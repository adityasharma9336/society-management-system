import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MemberDashboard from '../pages/MemberDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import PageTransition from './PageTransition';

export default function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />

                {/* Authentication */}
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

                {/* Dashboard Routes - Temporarily unprotected until AuthContext is restored */}
                <Route path="/dashboard" element={<PageTransition><MemberDashboard /></PageTransition>} />
                <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />

                {/* Catch all - Redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
}
