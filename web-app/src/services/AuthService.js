import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

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

const AuthService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email,
                password
            });
            
            console.log('Raw login response:', response.data);
            
            // Return the response data directly
            return response.data;
        } catch (error) {
            console.error('Login API error:', error);
            throw error;
        }
    },
    
    logout: () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    },
    
    verifyEmailToken: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Auth/verify`, {
                params: { token }
            });
            return response.data;
        } catch (error) {
            console.error('Token verification error:', error);
            throw error;
        }
    },
    
    completeRegistration: async (registrationData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/Auth/complete-registration`, registrationData);
            return response.data;
        } catch (error) {
            console.error('Registration completion error:', error);
            throw error;
        }
    },
    
    // Add other auth-related methods as needed
};

export default AuthService; 