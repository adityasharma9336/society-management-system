import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-slate-50 transition-colors duration-200">
                    <AnimatedRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;