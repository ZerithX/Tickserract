import { Context, Next } from "hono";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const verifyAuth = async (c: Context, next: Next) => {
  const authMiddleware = jwt({
    secret: JWT_SECRET,
    alg: "HS256",
  });

  return authMiddleware(c, next);
};

export const verifyRole = (roles: string[]) => {
  return async (c: Context, next: Next) => {
    const payload = c.get("jwtPayload");
    if (!payload || !roles.includes(payload.role)) {
      throw new HTTPException(403, {
        message: "You do not have permission to access this resource",
      });
    }
    await next();
  };
};
