import { z } from "zod";

// Address schema
const addressSchema = z.object({
  country_id: z.string().nullable().optional(),
  state_id: z.string().nullable().optional(),
  address_line_1: z.string().nullable().optional(),
  address_line_2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  zip_code: z.string().nullable().optional()
});

// Store hours schema
const storeHourSchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ]),
  open_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").optional(),
  close_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").optional(),
  is_open: z.boolean().optional()
});

// Main store schema
export const storeSchema = z.object({
  user_id: z.string().optional(),
  name: z.string()
    .min(3, "Store name must be at least 3 characters")
    .max(100, "Store name must not exceed 100 characters"),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  email: z.string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  brand_name: z.string()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Brand name must not exceed 100 characters")
    .or(z.literal("")),
  phone: z.string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format")
    .nullable()
    .optional()
    .or(z.literal("")),
  policy: z.string()
    .min(10, "Policy must be at least 10 characters")
    .nullable()
    .optional()
    .or(z.literal("")),
  about: z.string()
    .min(10, "About section must be at least 10 characters")
    .nullable()
    .optional()
    .or(z.literal("")),
  cover_photo: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Cover photo must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Cover photo must be a valid image (JPEG, PNG, or WebP)"
    )
    .nullable()
    .optional(),
  logo: z.instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, "Logo must be less than 2MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Logo must be a valid image (JPEG, PNG, or WebP)"
    )
    .nullable()
    .optional(),
  contact_visible: z.boolean().default(true),
//   is_active: z.boolean().default(true),
  is_verified: z.boolean().default(false),
  shipping_type: z.enum(["national", "international", "local"]),
  store_hours: z.array(storeHourSchema).length(7, "Must have exactly 7 days").nullable().optional(),
  address: addressSchema.optional()
});

// Type inference from schema
export type StoreFormData = z.infer<typeof storeSchema>;

// Validation helper function
export const validateStoreForm = (data: unknown) => {
  return storeSchema.safeParse(data);
};

// Step-by-step validation schemas
export const storeInfoSchema = storeSchema.pick({
  name: true,
  slug: true,
  email: true,
  username: true,
  brand_name: true,
  phone: true
});

export const addressStepSchema = z.object({
  address: addressSchema
});

export const detailsSchema = storeSchema.pick({
  about: true,
  policy: true,
  shipping_type: true,
  contact_visible: true,
});

export const mediaSchema = storeSchema.pick({
  cover_photo: true,
  logo: true
});

export const hoursSchema = z.object({
  store_hours: z.array(storeHourSchema).length(7)
});