import { Link } from "react-router-dom";

export default function ProductCard(props) {
    
    const product = props.product || {
        productId: "PRD-001",
        name: "Premium Wireless Headphones",
        category: "Electronics",
        price: 149.99,
        labelledPrice: 199.99,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=275&fit=crop"]
    };

    return (
        <Link to={"/overview/"+product.productId} 
            className="relative group max-w-sm mx-auto">
            
            {/* Blurred Gradient Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            {/* Inner Card */}
            <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                
                {/* Image Container */}
                <div className="relative overflow-hidden">
                    <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-40 rounded-lg object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {product.labelledPrice > product.price && (
                        <div className="absolute top-2 left-2">
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                {Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="p-3 space-y-2">

                    {/* Product Name & Category */}
                    <div className="space-y-1 text-center">
                        <h2 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight pb-2">
                            {product.name}
                        </h2>
                        <span className="inline-block bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm px-2 py-1 rounded-full font-medium">
                            {product.category}
                        </span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center space-x-2 justify-center">
                        {product.labelledPrice > product.price ? (
                            <>
                                <span className="text-xl font-bold text-green-600">
                                    Rs.{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    Rs.{product.labelledPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-green-600">
                                Rs.{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
