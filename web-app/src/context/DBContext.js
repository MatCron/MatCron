import React, { createContext, useState, useEffect } from 'react';
import { indexedDBService } from '../services/indexedDB';

const DBContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225';

// Utility function to decode JWT token
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
        console.error('Error decoding token:', error);
        return null;
    }
};

export const DBProvider = ({ children }) => {
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const data = await indexedDBService.getAuthData();
                setSessionData(data);
                
                // Enhanced logging
                console.group('Session Data Details');
                console.log('Raw Session Data:', data);
                
                if (data?.token) {
                    const decodedToken = decodeToken(data.token);
                    console.log('Decoded Token:', decodedToken);
                    console.log('Token Expiration:', new Date(decodedToken?.exp * 1000).toLocaleString());
                    console.log('User Details:', data.user);
                } else {
                    console.log('No token found in session');
                }
                console.groupEnd();
                
            } catch (error) {
                console.error('Error fetching session data:', error);
            }
        };

        fetchSessionData();
    }, []);

    const value = {
        sessionData,
        setSessionData,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};

export default DBContext; 