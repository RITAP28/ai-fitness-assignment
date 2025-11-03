import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean | null;
    image: string | null;
};

type Session = {
    sessionId: string;
    userId: string;
    token: string;
    expiresAt: string | Date;
}

type AuthState = {
    user: User | null;
    session: Session | null;
    setAuth: (data: { user: User, session: Session }) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            setAuth: (data) => set({ user: data.user, session: data.session }),
            clearAuth: () => set({ user: null, session: null })
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, session: state.session })
        }
    )
);