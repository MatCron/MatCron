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
                                orgId: decodedToken.OrgId,
                                orgType: decodedToken.OrgType
                            });
                            console.log('Session restored successfully');
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
        setLoading(true);
        setError(null);
        
        try {
            const response = await authService.login(email, password);
            
            console.log('Login response:', response);
            
            // Handle the new response format
            if (response.success && response.data) {
                // Extract token from the new response format
                const token = response.data.token || response.token;
                
                if (!token) {
                    throw new Error('No token found in response');
                }
                
                localStorage.setItem('token', token);
                
                // Decode the token to get user info
                const decodedToken = decodeToken(token);
                console.log('Decoded token on login:', decodedToken);
                
                if (decodedToken) {
                    // Set user data from the decoded token or from response.data
                    setUser({
                        id: decodedToken.Id || response.data.id,
                        email: decodedToken.Email || response.data.email,
                        userType: decodedToken.UserType || response.data.userType,
                        orgId: decodedToken.OrgId || response.data.orgId,
                        orgType: decodedToken.OrgType || response.data.orgType
                    });
                    
                    setToken(token);
                    return true;
                }
            } else if (response.token) {
                // Handle the old response format (for backward compatibility)
                localStorage.setItem('token', response.token);
                
                // Decode the token to get user info
                const decodedToken = decodeToken(response.token);
                console.log('Decoded token on login (old format):', decodedToken);
                
                if (decodedToken) {
                    setUser({
                        id: decodedToken.Id,
                        email: decodedToken.Email,
                        userType: decodedToken.UserType,
                        orgId: decodedToken.OrgId,
                        orgType: decodedToken.OrgType
                    });
                    
                    setToken(response.token);
                    return true;
                }
            }
            
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to login');
            throw error;
        } finally {
            setLoading(false);
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