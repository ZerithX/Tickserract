import { z } from "zod";

// --- AUTH SCHEMAS ---
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

// --- EVENT SCHEMAS ---
export const createEventSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  category: z.string(),
  date: z.string().datetime(),
  venue: z.string(),
  posterUrl: z.string().url().optional(),
});

// --- ORDER SCHEMAS ---
export const createOrderSchema = z.object({
  eventId: z.string().uuid(),
  tierId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
