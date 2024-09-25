export enum UserRole {
    CLIENT = 'CLIENT',
    SPECIALIST = 'SPECIALIST',
    ADMINISTRATOR = 'ADMINISTRATOR'
}

export interface User {
    id?: number;
    email: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    isLoginModalOpen: boolean;
    isRegistrationModalOpen: boolean;
}