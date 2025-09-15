// src/lib/validation/schemas.ts
import { z } from 'zod';

// Profile validation schemas
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.string().datetime(),
});

export const CreateProfileSchema = z.object({
  email: z.string().email(),
});

export const UpdateProfileSchema = z.object({
  email: z.string().email().optional(),
});

// Auth validation schemas
export const LoginSchema = z.object({
  email: z.string().email(),
});

// API response schemas
export const ApiResponseSchema = z.object({
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
