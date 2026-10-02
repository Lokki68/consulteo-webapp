export const APPOINTMENT_STATUS = {
    pending: { label: 'En attente', color: 'yellow' },
    confirmed: { label: 'Confirmé', color: 'blue' },
    completed: { label: 'Terminé', color: 'green' },
    cancelled: { label: 'Annulé', color: 'red' },
    no_show: { label: 'Non vue', color: 'purple' },
} as const

export const CONSULTATION_TYPES = {
    phone: { label: 'Téléphone', icon: 'phone' },
    video: { label: 'Visioconférence', icon: 'video' },
    in_person: { label: 'En personne', icon: 'building' }
}as const

export const SPECIALITIES = [
    { value: "cardiology", label: "Cardiologie" },
    { value: "dermatology", label: "Dermatologie" },
    { value: "neurology", label: "Neurologie" },
    { value: "pediatrics", label: "Pédiatrie" },
    { value: "psychiatry", label: "Psychiatrie" },
    { value: "general", label: "Médecin généraliste" },
    { value: "dentistry", label: "Dentisterie" },
    { value: "orthopedics", label: "Orthopédie" }
]as const

export const DAYS_OF_WEEK = [
    { value: 0, label: "Dimanche" },
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" }
] as const;