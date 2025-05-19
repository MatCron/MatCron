import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        id: null,
        email: null,
        userType: null,
        orgId: null,
        token: null
    });

    const updateUserData = (token, decodedData) => {
        setUserData({
            id: decodedData.Id,
            email: decodedData.Email,
            userType: decodedData.UserType,
            orgId: decodedData.OrgId,
            token: token
        });
        
        // Log all user details
        console.group('User Session Details');
        console.log('Token:', token);
        console.log('User ID:', decodedData.Id);
        console.log('Email:', decodedData.Email);
        console.log('User Type:', decodedData.UserType);
        console.log('Organization ID:', decodedData.OrgId);
        console.groupEnd();
    };

    const clearUserData = () => {
        setUserData({
            id: null,
            email: null,
            userType: null,
            orgId: null,
            token: null
        });
    };

    return (
        <UserContext.Provider value={{ userData, updateUserData, clearUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext; 