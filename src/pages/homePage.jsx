import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import HomeSlider from "../components/homeSlide";
import NavBar from "../components/nav";

// Home Page Product Card Component
const HomeProductCard = ({ product }) => {
  return (
    <Link
      to={"/overview/" + product.productId}
      className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
    >
      {/* Image Container with Padding */}
      <div className="relative overflow-hidden p-4 bg-gradient-to-br from-gray-50 to-indigo-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl shadow-sm"
        />
        {product.labelledPrice > product.price && (
          <div className="absolute top-6 right-6">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}% OFF
            </span>
          </div>
        )}
        {product.price >= 5000 && (
          <div className="absolute top-6 left-6">
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              FREE SHIPPING
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-semibold">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-800 mb-4 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Rs.{product.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {product.labelledPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                Rs.{product.labelledPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Product Category Slider Component
const ProductCategorySlider = ({ category, products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsToShow = 5;

  const nextSlide = () => {
    const maxIndex = Math.max(0, products.length - productsToShow);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const canGoNext = currentIndex < products.length - productsToShow;
  const canGoPrev = currentIndex > 0;

  return (
    <div className="mb-20">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {category}
          </h3>
          <p className="text-gray-600">Premium quality products for your skincare routine</p>
        </div>
        <Link
          to="/product"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          View More
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Products Slider */}
      <div className="relative">
        {/* Navigation Buttons */}
        {canGoPrev && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-200 hover:border-indigo-300"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {canGoNext && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-200 hover:border-indigo-300"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Products Container */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-in-out gap-8 px-4"
            style={{ transform: `translateX(-${currentIndex * (100 / productsToShow)}%)` }}
          >
            {products.map((product) => (
              <div
                key={product.productId}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / productsToShow}% - 32px)` }}
              >
                <HomeProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {products.length > productsToShow && (
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: Math.max(1, products.length - productsToShow + 1) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${currentIndex === index
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400 w-3"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Premium Quality",
      description: "All products are tested and certified for the highest quality standards"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Fast Delivery",
      description: "Quick and secure delivery to your doorstep within 2-3 business days"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Natural Ingredients",
      description: "Crafted with organic and natural ingredients for sensitive skin"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best skincare experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["Cream", "Face Wash", "Serum", "Power", "Lipstick"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Group products by category
  const getProductsByCategory = (category) => {
    return products.filter(
      (product) => product.category && product.category.toLowerCase() === category.toLowerCase()
    );
  };

  return (
    <div>
      <NavBar />
      <HomeSlider />

      {/* Offers Section */}
      <section className="bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 py-12 ">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Special Offers!</h2>
          <p className="text-lg mb-6">
            Buy products above Rs. 5000 and get FREE shipping
          </p>
          <Link to="/product" className="bg-white text-pink-500 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
            Shop Now
          </Link>
        </div>
      </section>


      {/* Products Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Our Product Categories
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collection of premium skincare products designed to enhance your natural beauty
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-96">
              <div className="relative">
                <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse bg-indigo-600 rounded-full h-4 w-4"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-20">
              {categories.map((category) => {
                const categoryProducts = getProductsByCategory(category);

                if (categoryProducts.length === 0) return null;

                return (
                  <ProductCategorySlider key={category} category={category} products={categoryProducts} />
                );
              })}
            </div>
          )}

          {/* Browse All Products CTA */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl shadow-2xl p-10 text-white max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
              <div className="relative">
                <h3 className="text-3xl font-bold mb-4">Explore Our Complete Collection</h3>
                <p className="text-white/90 text-lg mb-8">
                  Can't find what you're looking for? Browse our full product catalog with advanced filters and search
                </p>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-3 bg-white text-indigo-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Browse All Products
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <Footer />
    </div>
  );
}