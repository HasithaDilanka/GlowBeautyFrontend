import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-black via-blue-800 to-indigo-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-between gap-8">
                    
                    {/* Brand Section */}
                    <div className="flex-1 min-w-[250px]">
                        <div className="flex items-center mb-4">
                            <img
                                src="/src/assets/logo.png"
                                alt="GlowBeauty Logo"
                                className="w-12 h-12 mr-2"
                            />
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                                GlowBeauty 
                            </h2>
                        </div>
                        <p className="text-blue-200 mb-4 leading-relaxed">
                            Discover your natural beauty with our premium cosmetic products. Quality, elegance, and innovation in every product.
                        </p>
                        {/* Social Links – Add your icons if needed */}
                        <div className="flex space-x-4"></div>
                    </div>

                    {/* Shop Links */}
                    <div className="flex-1 min-w-[180px]">
                        <h4 className="text-lg font-semibold mb-4 text-blue-200">Shop</h4>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-blue-300 hover:text-white">Skincare</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">Makeup</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">Fragrance</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">Hair Care</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="flex-1 min-w-[180px]">
                        <h4 className="text-lg font-semibold mb-4 text-blue-200">Customer Service</h4>
                        <ul className="space-y-2">
                            <li><Link to="/contactUs" className="text-blue-300 hover:text-white">Contact Us</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">Shipping Info</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">Returns & Exchanges</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">Size Guide</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">FAQ</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">Track Order</Link></li>
                            <li><Link to="#" className="text-blue-300 hover:text-white">Gift Cards</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-[220px]">
                        <h4 className="text-lg font-semibold mb-4 text-blue-200">Get In Touch</h4>
                        <div className="space-y-3">
                            {/* Address */}
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                                </svg>
                                <span className="text-blue-200">123 Beauty Street, NY 10001</span>
                            </div>
                            {/* Phone */}
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20a1 1 0 0 1-1 1c-9.39 0-17-7.61-17-17a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                                <span className="text-blue-200">+1 (555) 123-4567</span>
                            </div>
                            {/* Email */}
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                <span className="text-blue-200">hello@glowbeauty.com</span>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="mt-6">
                            <h5 className="text-sm font-semibold text-blue-200 mb-2">Business Hours</h5>
                            <p className="text-blue-300 text-sm">Mon - Fri: 9:00 AM - 6:00 PM</p>
                            <p className="text-blue-300 text-sm">Sat: 10:00 AM - 4:00 PM</p>
                            <p className="text-blue-300 text-sm">Sun: Closed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-blue-700 py-6">
                <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8">
                    {/* Add trust badge icons if you have them */}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-blue-700 py-4 bg-blue-950">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-blue-300 text-sm">© 2025 GlowBeauty. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
