import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(2, "Name is required"),
        userName: z.string().min(2, "Username is required"),
        email: z.email(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type RegisterSchema = z.infer<typeof registerSchema>;
