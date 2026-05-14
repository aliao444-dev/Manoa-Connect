import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";

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

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const appUrl = process.env.APP_URL || "http://localhost:5000";

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${appUrl}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await authStorage.upsertUser({
            id: profile.id,
            email: profile.emails?.[0]?.value ?? null,
            firstName: profile.name?.givenName ?? null,
            lastName: profile.name?.familyName ?? null,
            profileImageUrl: profile.photos?.[0]?.value ?? null,
          });
          done(null, {
            claims: { sub: user.id, email: user.email, first_name: user.firstName },
            expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
          });
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, cb) => cb(null, user.claims.sub));
  passport.deserializeUser(async (id: string, cb) => {
    try {
      const user = await authStorage.getUser(id);
      if (!user) return cb(null, false);
      cb(null, {
        claims: { sub: user.id, email: user.email, first_name: user.firstName },
        expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      });
    } catch (err) {
      cb(err);
    }
  });

  app.get("/api/login", (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.redirect("/api/auth/google");
  });

  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/?auth=error",
    })
  );

  app.get("/api/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
};
