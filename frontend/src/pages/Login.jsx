import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('Resident');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Login successful!');
            if (role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f6f7f8] dark:bg-[#101922] min-h-screen flex items-center justify-center p-4 font-sans relative z-0">
            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Main Container */}
            <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden min-h-[700px]">
                {/* Left Side: Image/Branding Section (Hidden on small screens) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/80 to-transparent"></div>
                    <img
                        alt="Society Life"
                        className="absolute inset-0 w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhqQOST3JY1rgP4jREjiSJFCi17FE1N4OivxlvgNzwAAC9BndFKk4Q-FiIqPow8CouPvRnfMgyU_klMvIP5beZESlIF1MGbp95G7ItPyRjvLlV5_cva8j7jIFE2Ms06I6GrqnJpDnOoftgfElB4blWmWDl3_xVslLn9n5zpKMpJz6FQ-lHzlXUGIGMrl9Hn7Qf_HfqExVnjb8Dynm6XX6IZItA-36xWzOX2SbNWHypD5Gyi1jkluJap_Fy6cn7S_J7iM6dV5Y8WLs"
                    />
                    <div className="relative z-20 flex flex-col justify-end p-12 h-full text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <Link to="/" className="bg-white p-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </Link>
                            <h1 className="text-3xl font-extrabold tracking-tight">SocietyManager</h1>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-4">Smart living for modern communities.</h2>
                        <p className="text-lg text-white/90 max-w-md">Join over 5,000 societies managing their facilities, security, and finances seamlessly.</p>
                        <div className="mt-8 flex gap-4">
                            <div className="flex -space-x-2">
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkTDyCvalPrZjDcWTJ24vaFiwj4FvS8D7EzCfipAKHtVaOhJkAYfbFpTOOkASMY_QrbRCHnwl4zZ2MA5y8uWHaX76Zfe6Z5W0DEt_vuF5o2NCZfZsPx3TKubvcMZM05sOAR7TBtD4t3ApQ5l6JW_aypeaeHzFew-CnYQosUAiCuZB1kiW5m1vYmMiO9mM9Mcr2xKd9BFJ8bMbQRLXwnxWPYI-G6YVuGxk9pUi6oVVPuqoDjStPLdj9f0br2bvtPlbLvsUTUVoyigw" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuhfEnTKB45eXK6xsn7UC_jm_-RtbfZHOHJbrcAYryWHsikz_GnLYgxAJLgpHTkKzUNjvo8IzWXkElZfUt_kifMkkK5oq57Iw10OsdvbTwVM4SvXIRkCXI18mglzhZSmpK7ixtnUr0f_ynzHV6pq547QLOwtTD-5avOFDYev9NjJrBbHlx5171xBskZJ5HxjzK7-q0EvyGjzU5t3f_NrGpHD2FZLU1w1DSURWps025M8Kc71P93BqNCR61ebp6PG7WHpy5knykZH0" />
                                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User avatar 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlzgukYDPECfbgLf-_F63wr_XEDS1KuS8WLtEMCcKt9Jkov7mXSbhvWJbpjhAKl1etVXmJYEmVm6CM0mxeJBVMzmsVigHc95s5L8Zms7QUdF90EQ1khYkI07jEDL2ISUajFcU6c32NiMbciU9iue2QfxOfPavDhppQlNtBnnWJO5ktgPag7020tZJkGqLAHuQjDuJrKU8StT6JymifwJQvNVRAW9m-YE25Eu7xGtihXgRWT_xWvtTl9C8VJAai1mpqpDi4H4-Yai0" />
                            </div>
                            <p className="text-sm self-center">Trusted by 50k+ residents</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-20 bg-white dark:bg-slate-900 z-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">SocietyManager</span>
                        </Link>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Welcome Back</h3>
                        <p className="text-slate-500 dark:text-slate-400">Please enter your details to manage your society.</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('Resident')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${role === 'Resident' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Resident
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('Admin')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${role === 'Admin' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Admin
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Email/Username Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email or Username</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-slate-400">person</span>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                    placeholder="Enter your email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <a className="text-xs font-bold text-primary hover:underline" href="#">Forgot Password?</a>
                            </div>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-slate-400">lock</span>
                                <input
                                    className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary bg-white dark:bg-slate-900" id="remember" type="checkbox" />
                            <label className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none font-medium" htmlFor="remember">Remember me for 30 days</label>
                        </div>

                        {/* Login Button */}
                        <button
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>

                        {/* Divider */}
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-sm text-slate-700 dark:text-slate-300" type="button">
                                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwqHperpFwvn-hmEdltIfoY-HeNx6UWca3I7v7u2qR7Q7OZXeTqTFZfMw_-Yb4qkWEWjnPiwt22PdUXEWW5tgpFzNrfsy2yQakDhr1r6xhIkIu_LMnv1bOBMh8M20D2nayob6UdqgrGXJtF0TjhnX2qVEhTh9SLfqtzGf3_ot0UoC1jwb2Vp7OiupD_-rxWf3tlWCNxIuRrWRaHSjQakgQhEmy2rGfg7omtJXLVn-Gg71deo0kE2DTtx0O5VgS9QInYv7OjdNSCRU" />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-sm text-slate-700 dark:text-slate-300" type="button">
                                <img alt="LinkedIn" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtdDd8B6nqE_9zsfLeTYOiCYc2cSla6B5w_fnhnjKKsjvGKZel36LpBl-yNACxA_QORGIyr2f2CHpvkrpuHNts1Gq_MGcBZXhFJw86G_1_k7L0SHyeTILqUY8OaPBMpOM-rOjN_6ZoNs6ZUS-ddG16N6tGu3rt-rqpOkIhZs40rbqSJkXp2W9OwP_EwPgrxmNIFNi4FfqyYL5rj-c28ojU3L2k7956oLYGCnXRfle_maSRc_Cbr4pBhJStFE0s_WDSDdK7FhkvnGg" />
                                LinkedIn
                            </button>
                        </div>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-12 text-center">
                        <p className="text-slate-600 dark:text-slate-400">
                            Don't have an account?
                            <Link className="text-primary font-bold hover:underline ml-1" to="/register">Register your society</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
