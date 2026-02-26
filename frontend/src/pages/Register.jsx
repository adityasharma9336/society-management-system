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

    const [profilePicture, setProfilePicture] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setProfilePicture(reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register({ name, email, phone, flatNo, password, profilePicture });
            toast.success('Registration successful!');
            navigate('/dashboard');
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
                    {/* Registration Header */}
                    <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Join Your Society</h1>
                        <p className="mt-2 text-slate-500 text-sm">Create your account to manage your residency.</p>
                    </div>

                    {/* Registration Form */}
                    <form className="p-6 md:p-10 space-y-10" onSubmit={handleRegister}>
                        {/* Profile Photo Upload */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <input
                                    type="file"
                                    id="profile-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="profile-upload"
                                    className="block size-40 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all overflow-hidden relative group"
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-4xl text-slate-400">add_a_photo</span>
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="material-symbols-outlined text-white text-2xl">edit</span>
                                    </div>
                                </label>
                            </div>
                            <div className="text-center mt-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Profile Photo</h3>
                                <p className="text-sm text-slate-500">Upload a clear photo for your resident ID card</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        placeholder="John Doe"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        placeholder="john@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        placeholder="+1 (555) 000-0000"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Flat / Unit Number</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">apartment</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        placeholder="A-402"
                                        type="text"
                                        value={flatNo}
                                        onChange={(e) => setFlatNo(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Create Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                    <input
                                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 p-5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                            <input className="mt-1 rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-900" type="checkbox" id="terms" required />
                            <label htmlFor="terms" className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 cursor-pointer">
                                I agree to the <a className="text-primary font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-bold hover:underline" href="#">Privacy Policy</a>. I confirm that I am a resident of this society.
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 pt-2">
                            <button
                                className="w-full flex items-center justify-center gap-3 h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
                                type="submit"
                                disabled={loading}
                            >
                                <span className="text-lg">{loading ? 'Creating Account...' : 'Create Account'}</span>
                                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                            </button>
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                                Already have an account? <Link className="text-primary font-bold hover:underline ml-1" to="/login">Log in here</Link>
                            </p>
                        </div>
                    </form>

                    {/* Trust Footer */}
                    <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-center gap-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="material-symbols-outlined text-xl">verified_user</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Secure &amp; Encrypted</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="material-symbols-outlined text-xl">gpp_good</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Resident Verified</span>
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-10 text-center space-y-3">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Need help with registration?</p>
                    <div className="flex items-center justify-center gap-6">
                        <a className="flex items-center gap-1.5 text-primary text-xs font-bold hover:underline" href="#">
                            <span className="material-symbols-outlined text-lg">support_agent</span>
                            Contact Admin
                        </a>
                        <span className="text-slate-200 dark:text-slate-800">•</span>
                        <a className="flex items-center gap-1.5 text-primary text-xs font-bold hover:underline" href="#">
                            <span className="material-symbols-outlined text-lg">help_center</span>
                            View Tutorial
                        </a>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="mt-auto py-10 text-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <p className="text-xs text-slate-400 font-medium whitespace-nowrap">© 2024 SocietyManager. All rights reserved.</p>
            </footer>
        </div>
    );
}
