import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

export const registerSchema = z
    .object({
        email: z.string().email("Email invalide"),
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                "Le mot de passe doit contenir des majuscules, minuscules, chiffres et caractères spéciaux"
            ),
        passwordConfirm: z.string(),
        role: z.enum(["patient", "practitioner"]),
        fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères")
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Les mots de passe ne correspondent pas",
        path: ["passwordConfirm"]
    });

// Appointment Schemas
export const appointmentSchema = z.object({
    practitioner_id: z.string().uuid("ID praticien invalide"),
    scheduled_at: z
        .string()
        .datetime("Date invalide")
        .refine(
            (date) => new Date(date) > new Date(),
            "La date doit être dans le futur"
        ),
    duration: z.number().int().min(15).max(480),
    consultation_type: z.enum(["phone", "video", "in_person"]),
    notes: z.string().optional().default("")
});

export const appointmentUpdateSchema = z.object({
    scheduled_at: z.string().datetime().optional(),
    consultation_type: z.enum(["phone", "video", "in_person"]).optional(),
    notes: z.string().optional()
});

export const appointmentCancelSchema = z.object({
    cancellation_reason: z
        .string()
        .min(10, "La raison doit contenir au moins 10 caractères")
});

// Message Schemas
export const messageSchema = z.object({
    conversation_id: z.string().uuid("ID conversation invalide"),
    content: z
        .string()
        .min(1, "Le message ne peut pas être vide")
        .max(5000, "Le message ne peut pas dépasser 5000 caractères")
});

// Availability Schemas
export const availabilitySchema = z.object({
    day_of_week: z.number().int().min(0).max(6),
    start_time: z.string().regex(/^\d{2}:\d{2}$/),
    end_time: z.string().regex(/^\d{2}:\d{2}$/)
});

export const unavailabilitySchema = z.object({
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    reason: z.string().min(5)
});

// Practitioner Profile Schemas
export const practitionerProfileSchema = z.object({
    speciality: z.string().min(2),
    biography: z.string().min(10).optional(),
    phone: z.string().regex(/^\+?[0-9\s\-()]+$/),
    address: z.string().min(5),
    city: z.string().min(2),
    postal_code: z.string().regex(/^\d{5}$/),
    website: z.string().url().optional(),
    consultation_price: z.number().positive()
});

// Patient Profile Schemas
export const patientProfileSchema = z.object({
    phone: z.string().regex(/^\+?[0-9\s\-()]+$/),
    date_of_birth: z.string().date(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    postal_code: z.string().regex(/^\d{5}$/).optional()
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;
export type AppointmentCancelInput = z.infer<typeof appointmentCancelSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type UnavailabilityInput = z.infer<typeof unavailabilitySchema>;
export type PractitionerProfileInput = z.infer<
    typeof practitionerProfileSchema
>;
export type PatientProfileInput = z.infer<typeof patientProfileSchema>;