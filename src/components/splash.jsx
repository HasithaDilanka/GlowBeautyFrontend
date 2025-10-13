import { useState, useEffect } from 'react';
import { Sparkles, Heart, ShoppingBag } from 'lucide-react';

export default function SplashPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animations on mount
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setShowContent(true), 800);
  }, []);

  // Mock function to check if user is signed in
  // Replace this with your actual authentication logic
  const isUserSignedIn = () => {
    // Example: Check for token in memory or any auth state
    // return localStorage.getItem('authToken') !== null; // Don't use this in Claude artifacts
    // For demo purposes, randomly return true/false
    return Math.random() > 0.5;
  };

  // Handle Shop Now button click
  const handleShopNowClick = () => {
    if (isUserSignedIn()) {
      // User is signed in, navigate to home page
      window.location.href = '/';
    } else {
      // User is not signed in, navigate to login page
      window.location.href = '/login';
    }
  };

  const floatingItems = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className={`absolute w-2 h-2 bg-pink-300 rounded-full opacity-60 animate-bounce`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        {floatingItems}
        
        {/* Large Background Circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-rose-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Container */}
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative mb-8">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse" />
            
            {/* Main Logo Circle */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <img src = "src\assets\logo.png" className='w-17'/>
              </div>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <Heart className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 text-pink-400" />
              <ShoppingBag className="absolute bottom-0 right-0 w-5 h-5 text-purple-400" />
              <div className="absolute top-1/2 -left-2 w-3 h-3 bg-rose-400 rounded-full" />
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-pink-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className={`text-center mb-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-white via-rose-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            GlowBeauty
          </h1>
         
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Tagline */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-xl md:text-2xl text-white font-light max-w-md mx-auto leading-relaxed">
            Discover Your Natural Radiance
          </p>
          <p className="text-sm md:text-base text-white mt-2 max-w-lg mx-auto">
            Premium cosmetics for the modern woman & Men 
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button 
            onClick={handleShopNowClick}
            className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Shop Now
              <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}