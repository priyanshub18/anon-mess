import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(3, "Email or Username must be atleast 3 characters"),
  password: z.string().min(3, "Password must be atleast 3 characters"),
});
