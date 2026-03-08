import { z } from 'zod';

export const prayerRequestSchema = z.object({
    requester_name: z.string().min(2, 'Name must be at least 2 characters'),
    target_name: z.string().min(2, 'Target name must be at least 2 characters'),
    age: z.number().int().positive().optional().or(z.nan()),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    category: z.enum(['BLESSINGS', 'DEPARTED', 'SICK', 'BIRTHDAY', 'ANNIVERSARY', 'OTHER']),
    reason: z.string().optional(),
    notes: z.string().optional(),
    consent: z.boolean().refine((val) => val === true, 'You must confirm the details are accurate'),
    recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
});

export const contactFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password is too short'),
});
