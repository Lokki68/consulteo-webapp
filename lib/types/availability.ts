export interface Availability {
    id: string;
    practitioner_profile_id: string
    day_of_week: number
    start_time: string
    end_time: string
    created_at: Date
    updated_at: Date
}

export interface AvailabilityException {
    id: string
    practitioner_profile_id: string
    date: Date
    start_time: string
    end_time: string
    reason: string
    exception_type: 'closed' | 'open'
}

export interface AvailabilityRules {
    id: string
    practitioner_profile_id: string
    slot_duration_minutes: number
    day_of_week: number
    start_time: string
    end_time: string
    valid_from: Date
    valid_until?: Date
    active: boolean
    createdAt: Date
    updatedAt: Date
}