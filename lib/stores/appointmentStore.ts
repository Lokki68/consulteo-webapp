import { create } from 'zustand'
import {Appointment} from "@/lib/types/appointments.ts";

interface AppointmentFilter {
    status?: Appointment['status'];
    type?: Appointment['type'];
    dateFrom?: string;
    dateTo?: string;
}

interface AppointmentState {
    appointments: Appointment[];
    selectedAppointment: Appointment | null;
    isLoading: boolean;
    filter: AppointmentFilter;

    // actions
    setAppointments: (appointments: Appointment[]) => void;
    addAppointment: (appointment: Appointment) => void;
    updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
    setSelectedAppointment: (appointment: Appointment) => void;
    setLoading: (loading: boolean) => void;
    setFilter: (filter: AppointmentFilter) => void;
    getFilteredAppointments: () => Appointment[];
    clearFilter: () => void;
}


export const useAppointmentStore = create<AppointmentState>((set, get)) => ({
    appointments: [],
    selectedAppointment: null,
    isLoading: false,
    filter: {},

    setAppointments: (appointments: Appointment[]) => set({appointments}),

    addAppointment: (appointment: Appointment) => set((state: AppointmentState) => ({
            appointments: [appointment, ...state.appointments],
        })),

    updateAppointment: (id, updatedData) =>
        set((state) => ({
            appointments: state.appointments.map((apt) =>
                apt.id === id ? { ...apt, ...updatedData } : apt
            ),
            selectedAppointment:
                state.selectedAppointment?.id === id
                    ? { ...state.selectedAppointment, ...updatedData }
                    : state.selectedAppointment,
        })),

    setSelectedAppointment: (appointment) =>
        set({
            selectedAppointment: appointment,
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),

    setFilter: (filter) =>
        set({
            filter,
        }),

    getFilteredAppointments: () => {
        const state = get();
        return state.appointments.filter((apt) => {
            if (state.filter.status && apt.status !== state.filter.status)
                return false;
            if (state.filter.type && apt.type !== state.filter.type) return false;
            if (
                state.filter.dateFrom &&
                new Date(apt.startTime) < new Date(state.filter.dateFrom)
            )
                return false;
            if (
                state.filter.dateTo &&
                new Date(apt.endTime) > new Date(state.filter.dateTo)
            )
                return false;
            return true;
        });
    },

    clearFilter: () =>
        set({
            filter: {},
        }),
})