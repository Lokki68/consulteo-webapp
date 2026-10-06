export interface Appointment {
  id: string;
  patient_profile_id: string;
  practitioner_profile_id: string;
  scheduled_at: Date;
  duration: number;
  consultation_type: "phone" | "video" | "in_person";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'partially_paid'
  price_cents: number;
  reason: string;
  rescheduled_reason?: string
  cancellation_reason?: string;
  cancelled_at?: Date;
  cancelled_by_user_id?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
