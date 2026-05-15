import { Context } from "hono";
import { sign } from "hono/jwt";
import { createUser, getUserByEmail } from "../query/user.js";
import { loginSchema, registerSchema } from "@tickserract/shared";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        { success: false, message: result.error.errors[0].message },
        400
      );
    }

    const { email, password, name, role } = result.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return c.json({ success: false, message: "User already exists" }, 400);
    }

    const passwordHash = await Bun.password.hash(password);
    const user = await createUser({
      name,
      email,
      password, // Note: createUser in query/user.ts needs to be updated or we just pass the necessary fields
      role,
      passwordHash,
    });

    return c.json({
      success: true,
      message: "User registered successfully",
      data: { id: user.id, email: user.email },
    }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        { success: false, message: result.error.errors[0].message },
        400
      );
    }

    const { email, password } = result.data;

    const user = await getUserByEmail(email);
    if (!user) {
      return c.json({ success: false, message: "Invalid credentials" }, 401);
    }

    const isPasswordValid = await Bun.password.verify(password, user.passwordHash);
    if (!isPasswordValid) {
      return c.json({ success: false, message: "Invalid credentials" }, 401);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };

    const token = await sign(payload, JWT_SECRET);

    return c.json({
      success: true,
      message: "Login successful",
      data: { token },
    });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};

export const forgotPassword = async (c: Context) => {
  const { email } = await c.req.json();
  if (!email) {
    return c.json({ success: false, message: "Email is required" }, 400);
  }
  
  // Mocked email logic
  console.log(`Sending reset token to ${email}`);
  
  return c.json({
    success: true,
    message: "Reset token sent to your email (mocked)",
  });
};

export const resetPassword = async (c: Context) => {
  const { token, newPassword } = await c.req.json();
  if (!token || !newPassword) {
    return c.json({ success: false, message: "Token and new password are required" }, 400);
  }
  
  // Mocked reset logic
  return c.json({
    success: true,
    message: "Password reset successfully (mocked)",
  });
};
