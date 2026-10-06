export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    read_at: Date
    createdAt: Date
    updatedAt: Date
}

export interface Conversation {
    id: string
    appointment_id: string
    practitioner_profile_id: string
    patient_profile_id: string
    last_message_id: string
    status: 'active' | 'archived' | 'closed'
}