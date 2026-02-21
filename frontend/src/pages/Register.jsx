import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [flatNo, setFlatNo] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Note: Adjust the payload if backend requires different field names.
            await register({ name, email, phone, flatNo, password });
            toast.success('Registration successful!');
            navigate('/dashboard'); // Assuming a successful registration logs them in or takes them to the dashboard
        } catch (error) {
            toast.error(error.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f6f7f8] dark:bg-[#101922] min-h-screen font-sans flex flex-col">
            {/* Navigation Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="text-primary">
                            <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_6_330)">
                                    <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_6_330"><rect fill="white" height="48" width="48"></rect></clipPath>
                                </defs>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight">SocietyManager</h2>
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-6">
                        <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Support</a>
                        <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">FAQ</a>
                    </nav>
                    <Link className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all" to="/login">
                        Log In
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
                <div className="max-w-[640px] w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {/* Progress Section */}
                    <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Join Your Society</h1>
                            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 1 of 3</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-1/3 transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs font-bold text-primary">Personal Details</span>
                            <span className="text-xs font-medium text-slate-400">Unit Info</span>
                            <span className="text-xs font-medium text-slate-400">Security</span>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form className="p-6 md:p-8 space-y-8" onSubmit={handleRegister}>
                        {/* Profile Photo Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="size-32 rounded-full border-4 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                                    <img alt="Profile Upload" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2QN_lb7OhaAtPd4rZM9OR3_jRKN4mB-CL9BKVcrUlYTKbwFxXBhxVTl6gehH4eaffPY77rvFSKL-zjoH2CryQPZv5vx-1lxjLvabvm2R9wYq10Cz-KRJMFkxSqsKcvWz4zryVMqLQAfgzuIiMWplku8_Yl3ENOxGUZXM8377l5BGy-bs0AC3bQsf7lA40QJ6GjIgBYwbwfS560QQ1kTdTwPzllhqSHVWuK4Opx3ICnk1zz7E9bnK97fc4BMLmE85EDSx56VQiu44" />
                                </div>
                                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-slate-900 hover:scale-110 transition-transform" type="button">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Profile Photo</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Upload a clear photo for your resident ID card</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                    <input className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="John Doe" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                    <input className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="john@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))} required />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">phone</span>
                                    <input className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="+1 (555) 000-0000" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Flat / Unit Number</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">apartment</span>
                                    <input className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="A-402" type="text" value={flatNo} onChange={(e) => setFlatNo(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Create Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                    <input
                                        className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                <div className="flex gap-1 mt-2">
                                    <div className="h-1 flex-1 rounded bg-green-500"></div>
                                    <div className="h-1 flex-1 rounded bg-green-500"></div>
                                    <div className="h-1 flex-1 rounded bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="h-1 flex-1 rounded bg-slate-200 dark:bg-slate-700"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Password Strength: Good</p>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                            <input className="mt-1 rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-900" type="checkbox" id="terms" />
                            <label htmlFor="terms" className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 cursor-pointer">
                                I agree to the <a className="text-primary font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-bold hover:underline" href="#">Privacy Policy</a>. I confirm that I am a resident of this society.
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-2">
                            <button
                                className="w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                <span>{loading ? 'Creating...' : 'Create Account'}</span>
                                {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
                            </button>
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                                Already have an account? <Link className="text-primary font-bold hover:underline" to="/login">Log in here</Link>
                            </p>
                        </div>
                    </form>

                    {/* Trust Footer */}
                    <div className="p-6 bg-slate-100/50 dark:bg-slate-800/30 flex items-center justify-center gap-6 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="material-symbols-outlined text-lg">verified_user</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Secure &amp; Encrypted</span>
                        </div>
                        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="material-symbols-outlined text-lg">gpp_good</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Resident Verified</span>
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Need help with registration?</p>
                    <div className="flex items-center justify-center gap-4">
                        <a className="flex items-center gap-1 text-primary text-xs font-bold" href="#">
                            <span className="material-symbols-outlined text-base">support_agent</span>
                            Contact Admin
                        </a>
                        <span className="text-slate-300">•</span>
                        <a className="flex items-center gap-1 text-primary text-xs font-bold" href="#">
                            <span className="material-symbols-outlined text-base">help_center</span>
                            View Tutorial
                        </a>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="mt-auto py-8 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <p className="text-xs text-slate-400">© 2024 SocietyManager. All rights reserved.</p>
            </footer>
        </div>
    );
}
