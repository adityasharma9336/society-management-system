import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Features from '../components/landing/Features';
import Statistics from '../components/landing/Statistics';
import HowItWorks from '../components/landing/HowItWorks';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#101622] font-sans selection:bg-primary/30 selection:text-primary">
            <Navbar />
            <main>
                <Hero />
                <Statistics />
                <About />
                <Features />
                <HowItWorks />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}
