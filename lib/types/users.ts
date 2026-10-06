export interface User {
    id: string
    email: string
    fullname: string
    role: 'patient' | 'practitioner'
    avatar?: string
    created_at: Date
    updated_at: Date
}

export interface Practitioner extends User {
    speciality: string
    biography?: string
    phone: string
    address: string
    city: string
    postalCode: string
    website?: string
    consultationPrice: number
    rating?: number
    reviewsCount?: number
}

export interface Patient extends User {
    phone: string
    dateOfBirth?: Date
    address?: string
    city?: string
    postalCode?: string
}

export interface SessionType {
    user: User & {
        id: string
        role: 'patient' | 'practitioner'
    }
    token?: string
    expires: string
}