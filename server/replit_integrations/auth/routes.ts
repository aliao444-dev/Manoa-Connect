import type { Express } from "express";
import passport from "passport";
import { authStorage } from "./storage";
import { isAuthenticated, hashPassword } from "./replitAuth";

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/register", async (req: any, res, next) => {
    const { email, password, firstName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    try {
      const existing = await authStorage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }
      const passwordHash = await hashPassword(password);
      const user = await authStorage.upsertUser({
        email,
        firstName: firstName || email.split("@")[0],
        passwordHash,
      });
      const userSession = {
        claims: { sub: user.id, email: user.email, first_name: user.firstName },
        expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      };
      req.login(userSession, (err: any) => {
        if (err) return next(err);
        res.json({ success: true });
      });
    } catch (error) {
      console.error("Error registering:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.json({ success: true });
      });
    })(req, res, next);
  });

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
