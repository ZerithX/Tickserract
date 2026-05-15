import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import type { RegisterInput } from "@tickserract/shared";

export const getUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

export const createUser = async (data: RegisterInput & { passwordHash: string }) => {
  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role as "customer" | "organizer",
    })
    .returning();
  return user;
};
