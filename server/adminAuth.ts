import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;
const SECRET = ADMIN_PASSWORD_HASH;
const COOKIE_NAME = "auth";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("hex");
}

function createToken(email: string): string {
  const payload = JSON.stringify({ email, exp: Date.now() + COOKIE_MAX_AGE * 1000 });
  const signature = sign(payload);
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

function verifyToken(token: string): { email: string } | null {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return null;
    const payload = Buffer.from(payloadB64, "base64url").toString();
    const expectedSig = sign(payload);
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;
    const data = JSON.parse(payload);
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function getCookie(req: Request, name: string): string | undefined {
  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.split(";").find((c) => c.trim().startsWith(`${name}=`));
  return match ? match.split("=")[1] : undefined;
}

function setCookie(res: Response, name: string, value: string, maxAge: number) {
  res.setHeader(
    "Set-Cookie",
    `${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
  );
}

function clearCookie(res: Response, name: string) {
  res.setHeader("Set-Cookie", `${name}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}

export function isAdminAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = getCookie(req, COOKIE_NAME);
  const user = token ? verifyToken(token) : null;
  if (user && user.email === ADMIN_EMAIL) {
    (req as any).adminUser = user;
    return next();
  }
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
    const token = createToken(ADMIN_EMAIL);
    setCookie(res, COOKIE_NAME, token, COOKIE_MAX_AGE);
    res.json({ ok: true });
  });

  app.post("/api/auth/logout", (_req: Request, res: Response) => {
    clearCookie(res, COOKIE_NAME);
    res.json({ ok: true });
  });

  app.get("/api/auth/user", (req: Request, res: Response) => {
    const token = getCookie(req, COOKIE_NAME);
    const user = token ? verifyToken(token) : null;
    if (user && user.email === ADMIN_EMAIL) {
      return res.json({ email: ADMIN_EMAIL });
    }
    res.status(401).json({ message: "Not authenticated" });
  });
}
