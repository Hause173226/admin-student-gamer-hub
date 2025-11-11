import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import axiosInstance, { callRefreshToken, scheduleTokenRefresh, clearTokenRefresh } from '../utils/axiosInstance.ts';
import type { User } from '../types/index.ts';

interface JwtPayload {
    sub: string;
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: { userNameOrEmail: string; password: string }) => Promise<void>;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,

            login: async ({ userNameOrEmail, password }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axiosInstance.post('/Auth/login', {
                        userNameOrEmail,
                        password,
                        twoFactorCode: null,
                        twoFactorRecoveryCode: null,
                    });
                    console.log('🛡️ Response:', response.data);

                    const accessToken = response.data.AccessToken;
                    if (!accessToken) throw new Error('No token');

                    const decoded: JwtPayload = jwtDecode(accessToken);
                    console.log('🔓 Decoded:', decoded);

                    const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'student';
                    const nameClaim = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || userNameOrEmail;
                    const emailClaim = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || userNameOrEmail;

                    const userData: User = {
                        id: decoded.sub,
                        name: nameClaim,
                        email: emailClaim,
                        university: 'SGH University',
                        status: 'active',
                        role: roleClaim as 'student' | 'admin' | 'moderator',
                        joinedAt: new Date(decoded.iat * 1000).toISOString(),
                        lastActive: new Date().toISOString(),
                        gamesPlayed: 0,
                        hoursPlayed: 0,
                    };

                    localStorage.setItem('token', accessToken);
                    set({ user: userData, isLoggedIn: true, isLoading: false });
                    scheduleTokenRefresh(accessToken);
                    console.log('✅ Logged in! Role:', userData.role);
                } catch (err: any) {
                    let errorMsg = 'Login failed.';
                    if (err.response?.status === 401) errorMsg = 'Invalid credentials.';
                    set({ error: errorMsg, isLoading: false });
                    throw err;
                }
            },

            logout: () => {
                clearTokenRefresh();
                localStorage.removeItem('token');
                set({ user: null, isLoggedIn: false });
                window.location.href = '/login';
            },

            refreshAuth: async () => {
                try {
                    const newToken = await callRefreshToken();
                    const decoded: JwtPayload = jwtDecode(newToken);
                    const currentUser = get().user;
                    set({ user: currentUser ? { ...currentUser, lastActive: new Date().toISOString() } : null, isLoggedIn: true });
                    scheduleTokenRefresh(newToken);
                } catch (err) {
                    get().logout();
                }
            },
        }),
        { name: 'auth-storage' }
    )
);

export const useLogin = () => {
    const { login, isLoading, error } = useAuthStore();
    return { login, isLoading, error };
};