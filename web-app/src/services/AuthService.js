import axios from 'axios';

const API_URL = 'http://localhost:5225';

// Add token to all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Added token to request headers');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

const login = async (email, password) => {
    console.group('Auth Service - Login Request');
    try {
        console.log('Making login request to:', `${API_URL}/api/auth/login`);
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        });
        
        console.log('Server Response:', response.data);

        if (response.data.success) {
            console.log('Login successful');
            return {
                success: true,
                token: response.data.data.token,
                user: response.data.data
            };
        } else {
            console.error('Login failed:', response.data.error);
            throw new Error(response.data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login request failed:', error.response?.data || error);
        throw error.response?.data || error;
    } finally {
        console.groupEnd();
    }
};

const logout = () => {
    console.group('Auth Service - Logout');
    try {
        localStorage.removeItem('token');
        console.log('Token removed from localStorage');
        
        delete axios.defaults.headers.common['Authorization'];
        console.log('Authorization header removed');
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        console.groupEnd();
    }
};

const checkAuthStatus = async () => {
    console.group('Auth Service - Check Auth Status');
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    console.groupEnd();
    return token ? { token } : null;
};

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/Auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const authService = {
    login,
    logout,
    checkAuthStatus,
    register
};

export default authService; 