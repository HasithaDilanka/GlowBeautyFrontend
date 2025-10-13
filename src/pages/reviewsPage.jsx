import React, { useState, useEffect } from 'react';
import { Star, Send, User, Calendar, CheckCircle } from 'lucide-react';

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', product: '', title: '', review: '' });
  const [submittedReview, setSubmittedReview] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]); // ✅ DB reviews state

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setProducts([
            { name: "Luxe Glow Foundation" },
            { name: "Velvet Matte Lipstick" },
            { name: "Radiant Eye Palette" },
            { name: "Hydra Boost Serum" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([
          { name: "Luxe Glow Foundation" },
          { name: "Velvet Matte Lipstick" },
          { name: "Radiant Eye Palette" },
          { name: "Hydra Boost Serum" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/reviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleInputChange = (e) => setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });

  // ✅ Save review to backend
  const handleSubmit = async () => {
    if (rating > 0 && reviewForm.name && reviewForm.review) {
      const newReview = { 
        ...reviewForm, 
        rating, 
        date: new Date().toISOString().split('T')[0], 
        verified: true 
      };

      try {
        const response = await fetch("http://localhost:3000/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        });

        if (response.ok) {
          const savedReview = await response.json();
          setSubmittedReview(savedReview);
          setReviews([savedReview, ...reviews]); // add new review to list
          setReviewForm({ name: '', email: '', product: '', title: '', review: '' });
          setRating(0);
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  const renderStars = (count, interactive = false, size = 'w-6 h-6') => (
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} cursor-pointer transition-colors duration-200 ${i < (interactive ? (hoverRating || rating) : count) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      />
    ))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-800 to-indigo-900 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Customer Reviews</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Share your experience and discover what others love about our cosmetics</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-2">
            <button onClick={() => setActiveTab('submit')} className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'submit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-blue-200 hover:text-white'}`}>Write Review</button>
            <button onClick={() => setActiveTab('view')} className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'view' ? 'bg-indigo-600 text-white shadow-lg' : 'text-blue-200 hover:text-white'}`}>View Reviews</button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'submit' ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Share Your Experience</h2>
              {submittedReview && (
                <div className="bg-green-500 bg-opacity-20 border border-green-400 rounded-lg p-4 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-green-100">Thank you! Your review has been submitted successfully.</span>
                </div>
              )}
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <label className="block text-white font-semibold mr-4">Rating *</label>
                  <div className="flex space-x-1">
                    {renderStars(rating, true)}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Name *</label>
                    <input type="text" name="name" value={reviewForm.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Email</label>
                    <input type="email" name="email" value={reviewForm.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Product</label>
                  <select
                    name="product"
                    value={reviewForm.product}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    disabled={loading}
                  >
                    <option value="" className="bg-gray-800">
                      {loading ? "Loading products..." : "Select a product"}
                    </option>
                    {products.map((product) => (
                      <option key={product._id || product.name} value={product.name} className="bg-gray-800">
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Review Title</label>
                  <input type="text" name="title" value={reviewForm.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Summarize your experience..." />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Your Review *</label>
                  <textarea name="review" value={reviewForm.review} onChange={handleInputChange} rows="6" className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" placeholder="Tell us about your experience..." required />
                </div>
                <button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg">
                  <Send className="w-5 h-5" /><span>Submit Review</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">What Our Customers Say</h2>
              </div>
              {reviews.length === 0 ? (
                <p className="text-center text-blue-200">No reviews yet.</p>
              ) : (
                reviews.map((review, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">{review.name}</h3>
                            {review.verified && <CheckCircle className="w-4 h-4 text-green-400" />}
                          </div>
                          <div className="flex items-center space-x-2 text-blue-200 text-sm">
                            <Calendar className="w-4 h-4" /><span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {renderStars(review.rating, false, 'w-5 h-5')}
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-3">{review.product}</span>
                      <h4 className="text-lg font-semibold text-white mb-2">{review.title}</h4>
                      <p className="text-blue-100 leading-relaxed">{review.review}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
