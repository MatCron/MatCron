import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    // Check token validity on app startup
    useEffect(() => {
        const validateTokenOnStartup = async () => {
            console.group('Token Validation on Startup');
            try {
                const storedToken = localStorage.getItem('token');
                console.log('Stored token exists:', !!storedToken);
                
                if (storedToken) {
                    const isExpired = isTokenExpired(storedToken);
                    console.log('Token expired:', isExpired);
                    
                    if (!isExpired) {
                        const decodedToken = decodeToken(storedToken);
                        console.log('Decoded token:', decodedToken);
                        
                        if (decodedToken) {
                            setToken(storedToken);
                            setUser({
                                id: decodedToken.Id,
                                email: decodedToken.Email,
                                userType: decodedToken.UserType,
                                orgId: decodedToken.OrgId
                            });
                            console.log('Session restored successfully');
                            navigate('/dashboard');
                        }
                    } else {
                        console.log('Token is expired, logging out');
                        handleLogout();
                    }
                } else {
                    console.log('No stored token found');
                }
            } catch (error) {
                console.error('Token validation error:', error);
                handleLogout();
            } finally {
                setLoading(false);
                console.groupEnd();
            }
        };

        validateTokenOnStartup();
    }, [navigate]);

    const login = async (email, password) => {
        console.group('Login Process');
        try {
            setLoading(true);
            setError(null);
            
            console.log('Starting login attempt for:', email);
            
            const response = await authService.login(email, password);
            console.log('Login API Response:', response);

            if (response.success && response.token) {
                const decodedToken = decodeToken(response.token);
                console.log('Token decoded successfully:', decodedToken);

                if (!decodedToken) {
                    throw new Error('Failed to decode token');
                }

                setToken(response.token);
                setUser({
                    id: decodedToken.Id,
                    email: decodedToken.Email,
                    userType: decodedToken.UserType,
                    orgId: decodedToken.OrgId
                });

                localStorage.setItem('token', response.token);

                console.group('User Session Established');
                console.log('Token stored in localStorage');
                console.log('User ID:', decodedToken.Id);
                console.log('Email:', decodedToken.Email);
                console.log('User Type:', decodedToken.UserType);
                console.log('Organization ID:', decodedToken.OrgId);
                
                console.groupEnd();

                console.log('Redirecting to dashboard...');
                navigate('/dashboard');
                
                return { success: true };
            } else {
                console.error('Invalid response format:', response);
                throw new Error(response.error || 'Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'An error occurred during login');
            throw error;
        } finally {
            setLoading(false);
            console.groupEnd();
        }
    };

    const handleLogout = () => {
        console.group('Logout Process');
        // Clear frontend state
        setUser(null);
        setToken(null);
        setError(null);
        
        // Clear storage and headers
        authService.logout();
        
        console.log('All states cleared');
        console.log('Redirecting to login page...');
        
        // Navigate to login
        navigate('/login', { replace: true });
        console.groupEnd();
    };

    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    };

    const isTokenExpired = (token) => {
        try {
            const decodedToken = decodeToken(token);
            if (!decodedToken) return true;
            
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();
            
            console.log('Token expiration check:', {
                expirationTime: new Date(expirationTime),
                currentTime: new Date(currentTime),
                isExpired: currentTime >= expirationTime
            });
            
            return currentTime >= expirationTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    };

    const getTokenDetails = () => {
        if (token) {
            return decodeToken(token);
        }
        return null;
    };

    const value = {
        user,
        loading,
        error,
        token,
        login,
        logout: handleLogout,
        isAuthenticated: !!user,
        getTokenDetails,
        isTokenExpired
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 