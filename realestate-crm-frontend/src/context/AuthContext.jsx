import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [broker, setBroker] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check session status on mount
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const response = await api.get('/auth/check');
            if (response.data.authenticated) {
                setBroker(response.data.broker);
            } else {
                setBroker(null);
            }
        } catch (error) {
            console.error('Session check error:', error);
            setBroker(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password, rememberMe) => {
        try {
            const response = await api.post('/auth/login', { 
                email, 
                password, 
                rememberMe 
            });
            setBroker(response.data.broker);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred during login'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setBroker(null);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred during logout'
            };
        }
    };

    const value = {
        broker,
        loading,
        login,
        logout,
        checkSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
