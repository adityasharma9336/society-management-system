import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-[#101622] pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="text-primary">
                                <span className="material-symbols-outlined text-3xl">apartment</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#111318] dark:text-white">SocietyManager</span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                            Empowering modern housing societies with smart, secure, and intuitive management tools.
                        </p>
                        <div className="flex space-x-4">
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#" aria-label="Facebook">
                                <i className="fa-brands fa-facebook text-xl"></i>
                            </a>
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#" aria-label="Twitter">
                                <i className="fa-brands fa-twitter text-xl"></i>
                            </a>
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#" aria-label="Instagram">
                                <i className="fa-brands fa-instagram text-xl"></i>
                            </a>
                            <a className="text-gray-400 hover:text-primary transition-colors" href="#" aria-label="LinkedIn">
                                <i className="fa-brands fa-linkedin text-xl"></i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#111318] dark:text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#features">Features</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#pricing">Pricing</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Case Studies</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Reviews</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#111318] dark:text-white mb-4">Support</h4>
                        <ul className="space-y-3">
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Help Center</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">API Documentation</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#contact">Contact Support</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">System Status</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#111318] dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Terms of Service</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Cookie Policy</a></li>
                            <li><a className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm" href="#">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2024 SocietyManager. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-sm text-gray-500">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
