import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, Star, Heart, ShoppingCart } from 'lucide-react';

const BeautyStoreLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(1);

  const categories = [
    {
      id: 1,
      name: "Cream",
      
    },
    {
      id: 2,
      name: "Face Wash",
      
    },
    {
      id: 3,
      name: "Power",
     
    },
   
  ];

  const products = [
    {
      id: 1,
      name: "Vitamin C Brightening Serum",
      brand: "GlowLux",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
      badge: "Best Seller",
      inStock: true
    },
    {
      id: 2,
      name: "Hydrating Face Moisturizer",
      brand: "AquaGlow",
      price: 32.50,
      originalPrice: null,
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
      badge: null,
      inStock: true
    },
    {
      id: 3,
      name: "Gentle Foam Cleanser",
      brand: "PureClean",
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=300&fit=crop",
      badge: "Sale",
      inStock: false
    },
    {
      id: 4,
      name: "Retinol Night Cream",
      brand: "NightGlow",
      price: 78.00,
      originalPrice: null,
      rating: 4.9,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop",
      badge: "Premium",
      inStock: true
    },
    {
      id: 5,
      name: "Hyaluronic Acid Serum",
      brand: "HydraLux",
      price: 55.99,
      originalPrice: 75.99,
      rating: 4.5,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop",
      badge: "New",
      inStock: true
    },
    {
      id: 6,
      name: "Niacinamide Pore Refining Toner",
      brand: "ClearSkin",
      price: 28.75,
      originalPrice: null,
      rating: 4.4,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop",
      badge: null,
      inStock: true
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategorySelect = (categoryId, subcategoryId = null) => {
    setSelectedCategory(subcategoryId || categoryId);
  };

  const getCurrentCategoryName = () => {
    const category = categories.find(cat => cat.id === selectedCategory);
    if (category) return category.name;

    // Check subcategories
    for (const cat of categories) {
      const subcat = cat.subcategories.find(sub => sub.id === selectedCategory);
      if (subcat) return subcat.name;
    }
    return "All Products";
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Best Seller": return "bg-green-100 text-green-800";
      case "Sale": return "bg-red-100 text-red-800";
      case "New": return "bg-blue-100 text-blue-800";
      case "Premium": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarVisible ? 'w-80' : 'w-0 overflow-hidden'}`}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
              <p className="text-sm text-gray-600 mt-1">Find your perfect products</p>
            </div>
            <button
              onClick={() => setSidebarVisible(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Categories List */}
          <div className="p-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="group">
                  {/* Main Category */}
                  <div
                    onClick={() => handleCategorySelect(category.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                        }`}>
                        {category.count}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.id);
                      }}
                      className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {expandedCategories[category.id] ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories[category.id] && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          onClick={() => handleCategorySelect(category.id, subcategory.id)}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 ${selectedCategory === subcategory.id
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                              : 'hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                          <span className="text-sm font-medium">{subcategory.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === subcategory.id
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-500'
                            }`}>
                            {subcategory.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Go to Shopping Button */}
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                <ShoppingCart className="h-5 w-5" />
                <span>Go to Shopping</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Show/Hide Button */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!sidebarVisible && (
              <button
                onClick={() => setSidebarVisible(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getCurrentCategoryName()}</h1>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                        product.badge
                      )}`}
                    >
                      {product.badge}
                    </div>
                  )}
                  <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-blue-500" />
                  </button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    {product.brand}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    disabled={!product.inStock}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${product.inStock
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeautyStoreLayout;