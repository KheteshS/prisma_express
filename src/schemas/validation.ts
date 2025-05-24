import { z } from "zod";

// Validation Schemas
export const signupSchema = z.object({
  username: z.string().email(),
  password: z.string(),
  firstname: z.string(),
  lastname: z.string(),
});

export const signInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

export const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  done: z.boolean().optional(),
});

export type signInType = z.infer<typeof signInSchema>;
export type signUpType = z.infer<typeof signupSchema>;
export type todoType = z.infer<typeof todoSchema>;
