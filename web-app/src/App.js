import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users/UsersPage';
import ConfirmRegistration from './pages/ConfirmRegistration';
import LandingPage from './pages/LandingPage';
import './App.css';
import MattressPage from './pages/Mattress/MattressPage';
import MattressTypePage from './pages/MattressType/MattressTypePage';
import CreateDPPForm from './pages/MattressType/CreateDPPForm';
import ExtractionPage from './pages/Extraction/ExtractionPage';
import GuestPage from './pages/Guest/GuestPage';

// Loading component
const LoadingSpinner = () => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
    }}>
        <div>Loading...</div>
    </div>
);

// Protected Layout Component
const ProtectedLayout = () => {
    const { isAuthenticated, loading, token, isTokenExpired, user } = useAuth();

    console.group('Protected Route Check');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Loading:', loading);
    console.log('Token exists:', !!token);
    console.log('User:', user);
    if (token) {
        console.log('Token expired:', isTokenExpired(token));
    }
    console.groupEnd();

    if (loading) {
        console.log('Still loading, showing spinner...');
        return <LoadingSpinner />;
    }

    // Check if not authenticated or token is expired
    if (!isAuthenticated || (token && isTokenExpired(token))) {
        console.log('Authentication failed, redirecting to login...');
        return <Navigate to="/login" replace />;
    }

    console.log('Authentication successful, rendering protected content...');
    // Render the protected routes
    return <Outlet />;
};

// Public Layout Component
const PublicLayout = () => {
    const { isAuthenticated, loading } = useAuth();

    console.group('Public Route Check');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Loading:', loading);
    console.groupEnd();

    if (loading) {
        return <LoadingSpinner />;
    }

    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
        console.log('Already authenticated, redirecting to dashboard...');
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        {/* Landing page - accessible to everyone */}
                        <Route path="/" element={<LandingPage />} />
                        
                        {/* Public Guest Page - accessible without authentication */}
                        <Route path="/guest" element={<GuestPage />} />
                        
                        {/* Public Routes */}
                        <Route element={<PublicLayout />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/verify-email" element={<ConfirmRegistration />} />
                            {/* <Route path="/extraction" element={<ExtractionPage />} /> */}
                            {/* <Route path="/mattress" element={<MattressPage />} /> */}
                        </Route>

                        {/* Protected Routes */}
                        <Route element={<ProtectedLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/mattress" element={<MattressPage />} />
                            <Route path="/mattress-types" element={<MattressTypePage />} />
                            <Route path="/mattress-types/create-dpp" element={<CreateDPPForm />} />
                            <Route path="/extraction" element={<ExtractionPage />} />
                        </Route>

                        {/* Default redirect */}
                        <Route path="/" element={<Navigate to="/landing" replace />} />
                        
                        {/* Catch all route - redirect to landing page for new visitors */}
                        <Route path="*" element={
                            <Navigate to="/" replace />
                        } />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
