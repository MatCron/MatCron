import React from 'react';
import { ArrowRight, Bed, BarChart2, Clock, Shield, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import LightTheme_Logo from '../assets/images/Light_theme_logo_withoutbg_enhanced.png';
import MATCRON_Logo from '../assets/images/Soft Blue Modern How To Achieve Goals Instagram Post (4).png';

const LandingPage = () => {
    const navigate = useNavigate();
    
    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <header className="sticky top-0 z-50 bg-white shadow-sm py-4">
                <div className="container mx-auto max-w-6xl px-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <img 
                            src={LightTheme_Logo} 
                            alt="MATCRON" 
                            className="h-12 md:h-16"
                        />
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-slate-700 hover:text-teal-600 transition-colors">Features</a>
                        <a href="#testimonials" className="text-slate-700 hover:text-teal-600 transition-colors">Testimonials</a>
                        <a href="#pricing" className="text-slate-700 hover:text-teal-600 transition-colors">Pricing</a>
                        <a href="#contact" className="text-slate-700 hover:text-teal-600 transition-colors">Contact</a>
                    </nav>
                    <div className="flex items-center">
                        <button 
                            onClick={handleLoginRedirect}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section with light background */}
            <section className="py-24 px-6 md:px-10 lg:px-16 bg-teal-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex flex-col space-y-8 md:w-1/2 text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                                Mattress Lifecycle Management <span className="text-teal-600">Simplified</span>
                            </h1>
                            <p className="text-xl text-slate-600">
                                MATCRON helps hotels and hospitality businesses track, manage, and optimize 
                                the lifecycle of every mattress in their inventory.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button 
                                    onClick={handleLoginRedirect}
                                    className="px-6 py-3 text-base font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
                                >
                                    Get Started <ArrowRight className="ml-2 h-4 w-4 inline" />
                                </button>
                                <button className="px-6 py-3 text-base font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors">
                                    Book a Demo
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            {/* Just the image with a subtle shadow and hover effect */}
                            <div className="relative transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                {/* Subtle drop shadow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-teal-600/20 to-emerald-600/20 rounded-lg blur-xl opacity-70 -z-10"></div>
                                
                                {/* The image itself */}
                                <img 
                                    src={MATCRON_Logo} 
                                    alt="MATCRON Dashboard" 
                                    className="max-w-full h-auto object-contain"
                                    style={{ filter: 'drop-shadow(0 10px 15px rgba(20, 184, 166, 0.2))' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 px-6 md:px-10 lg:px-16 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <p className="text-3xl font-bold text-teal-600 mb-2">500+</p>
                            <p className="text-slate-600">Hotels Using MATCRON</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-bold text-teal-600 mb-2">250,000+</p>
                            <p className="text-slate-600">Mattresses Tracked</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-bold text-teal-600 mb-2">30%</p>
                            <p className="text-slate-600">Average Cost Reduction</p>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-bold text-teal-600 mb-2">98%</p>
                            <p className="text-slate-600">Customer Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 md:px-10 lg:px-16">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Choose MATCRON?</h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Our comprehensive mattress management system helps you optimize costs and improve guest satisfaction.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-4"><Bed className="h-10 w-10 text-teal-600" /></div>
                            <h3 className="text-xl font-semibold mb-2">Complete Inventory</h3>
                            <p className="text-slate-600">Track every mattress in your property with detailed information and history.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-4"><BarChart2 className="h-10 w-10 text-teal-600" /></div>
                            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
                            <p className="text-slate-600">Get insights on mattress durability, guest satisfaction, and replacement needs.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-4"><Clock className="h-10 w-10 text-teal-600" /></div>
                            <h3 className="text-xl font-semibold mb-2">Lifecycle Alerts</h3>
                            <p className="text-slate-600">Receive timely notifications for rotation, cleaning, and replacement schedules.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-4"><Shield className="h-10 w-10 text-teal-600" /></div>
                            <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
                            <p className="text-slate-600">Ensure consistent sleep quality for all your guests with proactive management.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 md:px-10 lg:px-16 bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How MATCRON Works</h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Our simple 3-step process makes mattress management effortless
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl mb-6">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Inventory Setup</h3>
                            <p className="text-slate-600">Quickly catalog all your mattresses with our mobile app or bulk import tool.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl mb-6">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Track & Monitor</h3>
                            <p className="text-slate-600">Automatically track mattress age, condition, and maintenance history.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl mb-6">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Optimize & Save</h3>
                            <p className="text-slate-600">Receive actionable insights to extend mattress life and reduce costs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section id="testimonials" className="py-16 px-6 md:px-10 lg:px-16 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-2xl font-semibold text-center mb-12 text-slate-700">Trusted by Leading Hospitality Brands</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
                        {/* Placeholder logos - replace with actual hotel brand logos */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-12 w-32 bg-slate-100 rounded flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                Logo {i}
                            </div>
                        ))}
                    </div>
                    
                    {/* Testimonial */}
                    <div className="mt-20 bg-slate-50 p-8 rounded-lg shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6">
                                <svg className="h-12 w-12 text-teal-300" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                </svg>
                            </div>
                            <p className="text-xl text-slate-700 mb-6 max-w-3xl">
                                MATCRON has revolutionized how we manage our mattress inventory. We've reduced replacement costs by 35% while improving guest satisfaction scores related to sleep quality.
                            </p>
                            <div className="flex items-center justify-center">
                                <div className="h-12 w-12 rounded-full bg-slate-200 mr-4"></div>
                                <div className="text-left">
                                    <p className="font-semibold">Jane Smith</p>
                                    <p className="text-sm text-slate-500">Operations Director, Grand Hotel Group</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-6 md:px-10 lg:px-16 bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Choose the plan that's right for your property
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col p-8 rounded-lg bg-white border border-slate-200">
                            <h3 className="text-xl font-bold mb-2 text-slate-800">Starter</h3>
                            <p className="text-slate-600 mb-4">Perfect for small hotels</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">$99</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {["Up to 100 mattresses", "Basic reporting", "Email support", "1 user account"].map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <ChevronRight className="h-5 w-5 text-teal-500 mr-2 shrink-0" />
                                        <span className="text-slate-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-auto px-6 py-3 text-base font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                                Get Started
                            </button>
                        </div>
                        <div className="flex flex-col p-8 rounded-lg bg-teal-50 border-2 border-teal-200 shadow-md">
                            <h3 className="text-xl font-bold mb-2 text-teal-700">Professional</h3>
                            <p className="text-slate-600 mb-4">Ideal for mid-size properties</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">$299</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {["Up to 500 mattresses", "Advanced analytics", "Priority support", "5 user accounts", "API access"].map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <ChevronRight className="h-5 w-5 text-teal-500 mr-2 shrink-0" />
                                        <span className="text-slate-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-auto px-6 py-3 text-base font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors">
                                Get Started
                            </button>
                        </div>
                        <div className="flex flex-col p-8 rounded-lg bg-white border border-slate-200">
                            <h3 className="text-xl font-bold mb-2 text-slate-800">Enterprise</h3>
                            <p className="text-slate-600 mb-4">For hotel chains and resorts</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">Custom</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {["Unlimited mattresses", "Custom reporting", "Dedicated account manager", "Unlimited users", "Full API access", "White-labeling options"].map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <ChevronRight className="h-5 w-5 text-teal-500 mr-2 shrink-0" />
                                        <span className="text-slate-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-auto px-6 py-3 text-base font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 md:px-10 lg:px-16 bg-teal-600 text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Mattress Management?</h2>
                    <p className="text-xl mb-10 text-teal-100">
                        Join hundreds of hotels that have improved guest satisfaction and reduced costs with MATCRON.
                    </p>
                    <button 
                        onClick={handleLoginRedirect}
                        className="px-6 py-3 text-base font-medium rounded-md bg-white text-teal-600 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600 transition-colors"
                    >
                        Start Your Free Trial
                    </button>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-6 md:px-10 lg:px-16 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                            <p className="text-lg text-slate-600 mb-8">
                                Have questions about MATCRON? Our team is here to help you find the perfect solution for your property.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-700">contact@matcron.com</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-700">+1 (800) 123-4567</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-lg">
                            <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input type="text" id="name" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" id="email" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                    <textarea id="message" rows="4" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"></textarea>
                                </div>
                                <button type="submit" className="w-full px-6 py-3 text-base font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 md:px-10 lg:px-16 bg-slate-900 text-slate-300">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-8 md:mb-0">
                            <div className="mb-4">
                                <img 
                                    src={LightTheme_Logo} 
                                    alt="MATCRON" 
                                    className="h-10"
                                />
                            </div>
                            <p className="max-w-xs">
                                The complete mattress lifecycle tracking solution for the hospitality industry.
                            </p>
                            <div className="flex space-x-4 mt-6">
                                <a href="#" className="text-slate-400 hover:text-teal-400">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-slate-400 hover:text-teal-400">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-slate-400 hover:text-teal-400">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-teal-400">Features</a></li>
                                    <li><a href="#" className="hover:text-teal-400">Pricing</a></li>
                                    <li><a href="#" className="hover:text-teal-400">Case Studies</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-teal-400">About</a></li>
                                    <li><a href="#" className="hover:text-teal-400">Blog</a></li>
                                    <li><a href="#" className="hover:text-teal-400">Careers</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-teal-400">Contact</a></li>
                                    <li><a href="#" className="hover:text-teal-400">Documentation</a></li>
                                    <li><a href="#" className="hover:text-teal-400">FAQ</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
                        <p>© {new Date().getFullYear()} MATCRON. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;