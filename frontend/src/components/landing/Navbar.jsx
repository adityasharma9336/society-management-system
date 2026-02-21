import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-200 ${scrolled ? 'bg-white/90 border-[#f0f2f4] dark:bg-[#101622]/90 dark:border-gray-800' : 'bg-white/90 border-[#f0f2f4] dark:bg-[#101622]/90 dark:border-gray-800'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-3xl">apartment</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#111318] dark:text-white">SocietyManager</span>
                    </Link>
                    <nav className="hidden md:flex gap-8">
                        <a onClick={(e) => scrollToSection(e, 'about')} className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 transition-colors cursor-pointer" href="#about">About</a>
                        <a onClick={(e) => scrollToSection(e, 'features')} className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 transition-colors cursor-pointer" href="#features">Features</a>
                        <a onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 transition-colors cursor-pointer" href="#how-it-works">How It Works</a>
                        <a onClick={(e) => scrollToSection(e, 'contact')} className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 transition-colors cursor-pointer" href="#contact">Contact</a>
                    </nav>
                    <div className="flex gap-3">
                        <Link to="/login" className="hidden sm:flex h-9 px-4 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="flex h-9 px-4 items-center justify-center rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
