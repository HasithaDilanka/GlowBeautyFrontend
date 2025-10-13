import React, { useState, useEffect } from 'react';
import Footer from './footer';

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Floating cursor effect */}
            <div
                className="absolute w-6 h-6 bg-cyan-400 rounded-full pointer-events-none opacity-50 transition-all duration-300 ease-out"
                style={{
                    left: mousePosition.x - 12,
                    top: mousePosition.y - 12,
                    transform: `scale(${isHovered ? 1.5 : 1})`
                }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                {/* 404 Illustration */}
                <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                    <svg
                        width="300"
                        height="200"
                        viewBox="0 0 300 200"
                        className="drop-shadow-2xl"
                    >
                        {/* Robot body */}
                        <rect x="100" y="80" width="100" height="80" rx="10" fill="#4F46E5" stroke="#E5E7EB" strokeWidth="2"/>
                        
                        {/* Robot head */}
                        <rect x="110" y="40" width="80" height="60" rx="15" fill="#6366F1" stroke="#E5E7EB" strokeWidth="2"/>
                        
                        {/* Eyes */}
                        <circle cx="130" cy="65" r="8" fill="#EF4444" className="animate-pulse"/>
                        <circle cx="170" cy="65" r="8" fill="#EF4444" className="animate-pulse"/>
                        
                        {/* Mouth */}
                        <rect x="140" y="80" width="20" height="8" rx="4" fill="#374151"/>
                        
                        {/* Arms */}
                        <rect x="70" y="90" width="30" height="12" rx="6" fill="#4F46E5"/>
                        <rect x="200" y="90" width="30" height="12" rx="6" fill="#4F46E5"/>
                        
                        {/* Antenna */}
                        <line x1="150" y1="40" x2="150" y2="20" stroke="#E5E7EB" strokeWidth="2"/>
                        <circle cx="150" cy="20" r="4" fill="#10B981" className="animate-bounce"/>
                        
                        {/* 404 Text on robot */}
                        <text x="150" y="130" textAnchor="middle" className="fill-white text-sm font-bold">404</text>
                        
                        {/* Wrench */}
                        <g transform="translate(220, 85) rotate(25)">
                            <rect x="0" y="0" width="20" height="4" fill="#9CA3AF"/>
                            <rect x="16" y="-2" width="8" height="8" fill="#6B7280"/>
                        </g>
                    </svg>
                </div>

                {/* Main content */}
                <div className="text-center max-w-2xl">
                    <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 animate-pulse">
                        404
                    </h1>
                    
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                        Oops! Page Not Found
                    </h2>
                    
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                        It looks like the page you're looking for has gone on a little adventure. 
                        Our robot is working hard to find it, but in the meantime, let's get you back home!
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="/"
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <span className="relative z-10 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Go Home
                            </span>
                        </a>
                        
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent opacity-50"></div>
            
            {/* Floating shapes */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-cyan-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-40 right-32 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-1/4 w-8 h-8 bg-purple-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
        </div>
    );

}