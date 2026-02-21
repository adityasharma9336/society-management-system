import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="relative bg-white dark:bg-[#101622] pt-16 pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#111318] dark:text-white mb-6 leading-tight">
                        Smart &amp; Secure <span className="text-primary">Society Management</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Streamline operations, enhance security, and connect with your neighbors effortlessly. Experience the future of community living today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white text-base font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Register Now
                        </Link>
                        <Link to="/login" className="flex items-center justify-center h-12 px-8 rounded-lg bg-gray-100 text-[#111318] text-base font-bold hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-all">
                            Member Login
                        </Link>
                    </div>
                </div>
            </div>
            {/* Hero Background Image with Overlay */}
            <div className="mt-16 mx-4 md:mx-auto max-w-7xl rounded-2xl overflow-hidden relative h-[400px] md:h-[500px] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img alt="Modern apartment building complex against a blue sky" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH1x8qvKkn_VyBzTtT9fTJNnJYfc9SnOBHq3sxeQLhdb1v-GfTbdICN5Ck2gGVnCRHFpkK490yFk1dyf3YQKaGDf86QiuITRFu6AYdfmJKvt4JjhhZgurt4wxdB4t_iM89PLeEya9VfNQSWN60RV86GG4Qf2lQbgyhX9Lhh2msXO6ohaiCRFBEUIjlSu6P4VqALsMicvptr5AUWxxMVmTnGV1OhI8av8nxJGmGzZItGtC-F-7ysEF8cQ_a1nCBCUkLrZMSSOQ7E9g" />
                <div className="absolute bottom-8 left-8 z-20 text-white max-w-md">
                    <p className="font-bold text-lg mb-2">Trusted by 500+ Communities</p>
                    <div className="flex -space-x-2">
                        <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQqq1Lmp78AM2M9AWLalI1bcGZLhLxuoMwQA07tgpzFQitIS7TyFqvROp_rjwo_yEyeGd96s_aRiaFCgn8F-5sxwUfZrpw_x3ocP1xHPgiWyMwiuNJWUPiMT2Xq0ZtjEX-5cwWfnkl0mr1OJWVHHI1co4bTZjVTUvl-5ldZRQECiQXljazu4CsoJ820BJW-MUi3cEsaxqYS2usK0NBXlsMF4Mrxi__V-vwp5_uoj6d3kSunE6IELdGKZBBtXizL1MZB8pNMBYsVmA" />
                        <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCESWaG82daMHeqtHr_2evUZmuymxx3fmkaRRDqMK5ASjqvlQA5F8YMugOyThzJmTfIadWWF2V0NchvCyVaidzrLQnkguJb5vkLRj4QkYogfE2OcIDiEo5kV8d2DIZUZoNaIN9sUV4hKK_rjHE5dvbHUaYUyVyLOmT6uVM4-ju9w3qLI_fupBqU_6W9VFG6r1EFt1Vl4i5dLkNXIkTiMwwVxlzCJ5O7-_rvABQ-w9iLk9bhmnECyJDB5sCrGZLaypJseKhVKU02G-0" />
                        <img alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAETFWtEGimpikyjx12oA1ac4G7HnYlkIdgEHCuRSxUGMDA6yUZOci0EFR7pGRmEKcu4hR60iwfigexqQOsvxe_PVwy8LkeFLf7dLiI9oF-RRFdcNqxeq1JoZCDuUL668PD2NlWJTO2U6fmvuUNl57GM2kT5vXPG_2eli8qp90WbnFpaen9rmwGqNApeCfdiklDYN_QDQ7GpIeO920MdjoP92ZigRUZAG5YCLWexFNfjZyv1zyVD-OF0ZipxS9M4C_8LTMhCmxSmhw" />
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-xs font-bold">+2k</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
