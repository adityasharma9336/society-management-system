import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <div className="bg-sky-600" id="contact">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                    <span className="block">Ready to modernize your society?</span>
                    <span className="block text-sky-200">Start your free trial today.</span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-sky-600 bg-white hover:bg-sky-50"
                        >
                            Get started
                            <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="ml-3 inline-flex rounded-md shadow">
                        <Link
                            to="/features"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-700 hover:bg-sky-800"
                        >
                            Learn more
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
