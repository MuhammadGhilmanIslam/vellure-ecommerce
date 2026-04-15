import { z } from 'zod'

// ── Auth ─────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// ── Product ───────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  slug: z.string().optional(),
  shortDescription: z.string().max(160).optional(),
  description: z.string().min(10, 'Description required'),
  price: z.number().min(1000, 'Price must be at least Rp 1.000'),
  comparePrice: z.number().optional().nullable(),
  stock: z.number().min(0),
  sku: z.string().optional(),
  weight: z.number().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('DRAFT'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  tags: z.array(z.string()).optional(),
})

// ── Address ───────────────────────────────────────────────
export const addressSchema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z
    .string()
    .min(9, 'Phone number too short')
    .regex(/^[0-9+\-() ]+$/, 'Invalid phone number'),
  province: z.string().min(1, 'Province required'),
  city: z.string().min(1, 'City required'),
  district: z.string().min(1, 'District required'),
  fullAddress: z.string().min(10, 'Full address required'),
  postalCode: z.string().length(5, 'Postal code must be 5 digits'),
})

// ── Review ────────────────────────────────────────────────
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, 'Review must be at least 10 characters'),
})

// ── Checkout ───────────────────────────────────────────────
export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().min(9, 'Phone required'),
  address: addressSchema,
  courier: z.string().min(1, 'Select a courier'),
  courierService: z.string().min(1, 'Select a service'),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
})

// ── Coupon ─────────────────────────────────────────────────
export const couponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED', 'FREE_SHIPPING']),
  value: z.number().min(1),
  maxDiscount: z.number().optional().nullable(),
  minPurchase: z.number().optional().nullable(),
  maxUsage: z.number().optional().nullable(),
  maxPerUser: z.number().default(1),
  isActive: z.boolean().default(true),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type CouponInput = z.infer<typeof couponSchema>
