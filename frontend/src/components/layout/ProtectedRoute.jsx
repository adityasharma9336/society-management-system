import React from 'react';
import { Navigate } from 'react-router-dom';

// Placeholder auth logic. In a real app, this would check a token or context.
const useAuth = () => {
    // For testing, we can toggle this to false to see the redirect
    return { isAuthenticated: true };
};

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
