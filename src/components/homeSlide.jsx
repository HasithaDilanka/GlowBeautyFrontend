import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Luxe Glow Foundation",
      subtitle: "Flawless Coverage",
      description: "Achieve radiant, natural-looking skin with our award-winning foundation",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop&crop=center",
      gradient: "from-rose-400 via-pink-300 to-purple-400",
      buttonColor: "bg-rose-500 hover:bg-rose-600"
    },
    {
      id: 2,
      title: "Velvet Matte Lipstick",
      subtitle: "All-Day Comfort",
      description: "Rich, velvety color that stays put for up to 12 hours",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=600&fit=crop&crop=center",
      gradient: "from-red-400 via-pink-400 to-rose-400",
      buttonColor: "bg-red-500 hover:bg-red-600"
    },
    {
      id: 3,
      title: "Radiant Eye Palette",
      subtitle: "12 Stunning Shades",
      description: "Create endless looks with our versatile eyeshadow collection",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop&crop=center",
      gradient: "from-amber-400 via-orange-300 to-pink-400",
      buttonColor: "bg-amber-500 hover:bg-amber-600"
    },
    {
      id: 4,
      title: "Hydra Boost Serum",
      subtitle: "Deep Moisturization",
      description: "Intensive hydration with hyaluronic acid and vitamin E",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop&crop=center",
      gradient: "from-blue-400 via-cyan-300 to-teal-400",
      buttonColor: "bg-blue-500 hover:bg-blue-600"
    },

    {
      id: 5,
      title: "Nourishing Night Cream",
      subtitle: "Repair & Rejuvenate",
      description: "Wake up to refreshed, youthful skin with our overnight formula",
      rating: 4.8,
      image: "https://images.ctfassets.net/b7vjv6cc1lvj/7oceQP4TOzhKYAnzmL3Iao/e67dd0ef83dbfede746eb867b46effd7/night_cream_08.jpg?fm=webp&w=3840",
      gradient: "from-purple-400 via-pink-300 to-red-400",
      buttonColor: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl p-1 shadow-2xl">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className={`min-w-full h-full relative bg-gradient-to-br ${slide.gradient}`}>
            {/* Floating Background Circles */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full border border-white"></div>
              <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full border border-white"></div>
            </div>

            {/* Slide Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-8 grid md:grid-cols-2 gap-8 items-center">
                {/* Left Text Block */}
                <div className="text-white space-y-6">
                  <div>
                    <p className="text-sm font-medium opacity-90 tracking-wider uppercase mb-2">{slide.subtitle}</p>
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">{slide.title}</h1>
                    <p className="text-lg opacity-90 max-w-lg leading-relaxed">{slide.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(slide.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-white opacity-30'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">({slide.rating})</span>
                  </div>

                  {/* CTA */}
                  <button className={`${slide.buttonColor} text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}>
                    <ShoppingBag className="w-5 h-5" />
                    <Link to="/product">Shop Now</Link>
                  </button>
                </div>

                {/* Right Image */}
                <div className="relative">
                  <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                    />
                    {/* Top-right Floating Star */}
                    <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-lg rounded-full p-3 shadow-lg">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    </div>
                    {/* Bottom-left New Badge */}
                    <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-lg rounded-lg p-3 shadow-lg">
                      <span className="text-sm font-bold text-gray-800">New</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? 'bg-white scale-125'
              : 'bg-white/50 hover:bg-white/75'
              }`}
          />
        ))}
      </div>

      {/* Auto-Play Indicator */}
      <div className="absolute top-6 right-6">
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`} />
      </div>
    </div>
  );
};

export default HomeSlider;
