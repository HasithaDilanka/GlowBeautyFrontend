import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { FaRegUser } from 'react-icons/fa';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 relative">

                    {/* Left: Logo/Brand */}
                    <div className="flex items-center flex-shrink-0">
                        <img
                            className="w-12 h-12"
                            src="src/assets/logo.png"
                            alt="Logo"
                        />
                        <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                            GlowBeauty
                        </h1>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-6 text-lg">
                            <Link to="/" className="hover:text-yellow-500">Home</Link>
                            <Link to="/product" className="hover:text-yellow-500">Product</Link>
                            <Link to="/reviews" className="hover:text-yellow-500">Reviews</Link>
                            <Link to="/contactUs" className="hover:text-yellow-500">Contact Us</Link>

                        </div>
                    </div>

                    {/* Right: Cart Icon */}
                    <div className="flex items-center space-x-6">

                        <Link to="/cart" className="hover:text-yellow-400">
                            <ShoppingCart className="w-6 h-6" />
                        </Link>
                        <Link to="/user-profile" className="hover:text-yellow-500">
                            <FaRegUser className="w-6 h-6"/>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
