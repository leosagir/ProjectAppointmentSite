import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../types/auth';

export const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
};

export const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

export const decodeToken = (token: string): { role: UserRole; exp: number } | null => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return true;
    return decodedToken.exp * 1000 < Date.now();
};