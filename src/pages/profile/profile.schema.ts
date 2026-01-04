import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
