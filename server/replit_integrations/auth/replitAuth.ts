import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return timingSafeEqual(Buffer.from(hashed, "hex"), buf);
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

function makeUserSession(id: string, email: string | null, firstName: string | null) {
  return {
    claims: { sub: id, email, first_name: firstName },
    expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
  };
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const appUrl = process.env.APP_URL || "http://localhost:5000";

  // GitHub OAuth
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: `${appUrl}/api/auth/github/callback`,
        },
        async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
          try {
            const email = profile.emails?.[0]?.value ?? null;
            const nameParts = (profile.displayName || profile.username || "").split(" ");
            const user = await authStorage.upsertUser({
              id: `github_${profile.id}`,
              email,
              firstName: nameParts[0] ?? profile.username ?? null,
              lastName: nameParts.slice(1).join(" ") || null,
              profileImageUrl: profile.photos?.[0]?.value ?? null,
            });
            done(null, makeUserSession(user.id, user.email ?? null, user.firstName ?? null));
          } catch (err) {
            done(err);
          }
        }
      )
    );
  }

  // Google OAuth
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${appUrl}/api/auth/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const user = await authStorage.upsertUser({
              id: `google_${profile.id}`,
              email: profile.emails?.[0]?.value ?? null,
              firstName: profile.name?.givenName ?? null,
              lastName: profile.name?.familyName ?? null,
              profileImageUrl: profile.photos?.[0]?.value ?? null,
            });
            done(null, makeUserSession(user.id, user.email ?? null, user.firstName ?? null));
          } catch (err) {
            done(err as Error);
          }
        }
      )
    );
  }

  // Email/password
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await authStorage.getUserByEmail(email);
        if (!user || !user.passwordHash) {
          return done(null, false, { message: "Invalid email or password" });
        }
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return done(null, false, { message: "Invalid email or password" });
        done(null, makeUserSession(user.id, user.email ?? null, user.firstName ?? null));
      } catch (err) {
        done(err);
      }
    })
  );

  passport.serializeUser((user: any, cb) => cb(null, user.claims.sub));
  passport.deserializeUser(async (id: string, cb) => {
    try {
      const user = await authStorage.getUser(id);
      if (!user) return cb(null, false);
      cb(null, makeUserSession(user.id, user.email ?? null, user.firstName ?? null));
    } catch (err) {
      cb(err);
    }
  });

  app.get("/api/login", (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.redirect("/?auth=login");
  });

  app.get("/api/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
  app.get("/api/auth/github/callback",
    passport.authenticate("github", { successRedirect: "/", failureRedirect: "/?auth=error" })
  );

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/api/auth/google/callback",
    passport.authenticate("google", { successRedirect: "/", failureRedirect: "/?auth=error" })
  );

  app.get("/api/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
};
