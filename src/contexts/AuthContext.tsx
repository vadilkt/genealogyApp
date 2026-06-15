import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

import { setAuthToken, clearAuthToken } from '@/configs';

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    setAuth: (token: string, user: AuthUser) => void;
    clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedToken && storedUser) {
                const parsedUser = JSON.parse(storedUser) as AuthUser;
                setToken(storedToken);
                setUser(parsedUser);
                setAuthToken(storedToken);
            }
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setInitialized(true);
        }
    }, []);

    const setAuth = useCallback((newToken: string, newUser: AuthUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setAuthToken(newToken);
        setToken(newToken);
        setUser(newUser);
    }, []);

    const clearAuth = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearAuthToken();
        setToken(null);
        setUser(null);
    }, []);

    if (!initialized) return null;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isAdmin: user?.role === 'ADMIN',
                setAuth,
                clearAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
    return ctx;
};
