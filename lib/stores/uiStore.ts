import { create } from "zustand";

interface UIState {
    // Sidebar
    sidebarOpen: boolean;

    // Modals
    modals: {
        appointmentModal: boolean;
        appointmentDetailModal: boolean;
        messageModal: boolean;
        settingsModal: boolean;
        confirmModal: boolean;
    };

    // Drawers
    drawers: {
        notificationDrawer: boolean;
        profileDrawer: boolean;
    };

    // Theme
    theme: "light" | "dark" | "system";

    // Loading states
    loadingStates: Record<string, boolean>;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;

    // Modal actions
    openModal: (modal: keyof UIState["modals"]) => void;
    closeModal: (modal: keyof UIState["modals"]) => void;
    toggleModal: (modal: keyof UIState["modals"]) => void;
    closeAllModals: () => void;

    // Drawer actions
    openDrawer: (drawer: keyof UIState["drawers"]) => void;
    closeDrawer: (drawer: keyof UIState["drawers"]) => void;
    toggleDrawer: (drawer: keyof UIState["drawers"]) => void;

    // Theme actions
    setTheme: (theme: "light" | "dark" | "system") => void;

    // Loading state actions
    setLoading: (key: string, loading: boolean) => void;
    isLoading: (key: string) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
    sidebarOpen: true,
    modals: {
        appointmentModal: false,
        appointmentDetailModal: false,
        messageModal: false,
        settingsModal: false,
        confirmModal: false,
    },
    drawers: {
        notificationDrawer: false,
        profileDrawer: false,
    },
    theme: "system",
    loadingStates: {},

    toggleSidebar: () =>
        set((state) => ({
            sidebarOpen: !state.sidebarOpen,
        })),

    setSidebarOpen: (open) =>
        set({
            sidebarOpen: open,
        }),

    openModal: (modal) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [modal]: true,
            },
        })),

    closeModal: (modal) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [modal]: false,
            },
        })),

    toggleModal: (modal) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [modal]: !state.modals[modal],
            },
        })),

    closeAllModals: () =>
        set({
            modals: {
                appointmentModal: false,
                appointmentDetailModal: false,
                messageModal: false,
                settingsModal: false,
                confirmModal: false,
            },
        }),

    openDrawer: (drawer) =>
        set((state) => ({
            drawers: {
                ...state.drawers,
                [drawer]: true,
            },
        })),

    closeDrawer: (drawer) =>
        set((state) => ({
            drawers: {
                ...state.drawers,
                [drawer]: false,
            },
        })),

    toggleDrawer: (drawer) =>
        set((state) => ({
            drawers: {
                ...state.drawers,
                [drawer]: !state.drawers[drawer],
            },
        })),

    setTheme: (theme) =>
        set({
            theme,
        }),

    setLoading: (key, loading) =>
        set((state) => ({
            loadingStates: {
                ...state.loadingStates,
                [key]: loading,
            },
        })),

    isLoading: (key) => {
        return get().loadingStates[key] || false;
    },
}));