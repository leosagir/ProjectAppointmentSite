export enum UserRole {
    CLIENT = 'ROLE_CLIENT',
    SPECIALIST = 'ROLE_SPECIALIST',
    ADMINISTRATOR = 'ROLE_ADMINISTRATOR'
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