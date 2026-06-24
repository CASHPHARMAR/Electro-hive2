import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;

export function isAdminAuthenticated(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).adminLoggedIn) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export function registerAdminAuthRoutes(app: Express) {
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    (req.session as any).adminLoggedIn = true;
    req.session.save(() => {
      res.json({ ok: true });
    });
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/user", (req: Request, res: Response) => {
    if ((req.session as any).adminLoggedIn) {
      return res.json({ email: ADMIN_EMAIL });
    }
    res.status(401).json({ message: "Not authenticated" });
  });
}
