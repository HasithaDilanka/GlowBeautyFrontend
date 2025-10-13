import { useState } from "react";
import { addToCart, getCart, getTotal } from "../../utils/cart";
import { TbTrash } from "react-icons/tb";
import { ShoppingCartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const [cart, setCart] = useState(getCart());
    const navigate = useNavigate();

    const updateCart = () => {
        setCart(getCart());
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-gray-200/50">
                <div className="max-w-4xl mx-auto px-1 py-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
                            <ShoppingCartIcon size={20} />
                        </div>
                        <div>
                            <p className="text-gray-700 text-lg">
                                Review your items and proceed to checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Items */}
            <div className="w-full flex flex-col py-12 items-center">
                {cart.length === 0 ? (
                    <div className="w-full max-w-4xl h-64 flex flex-col justify-center items-center">
                        <div className="p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <ShoppingCartIcon size={32} className="text-gray-400" />
                                </div>
                                <span className="text-2xl text-gray-500 font-medium">
                                    Your cart is empty
                                </span>
                                <p className="text-gray-400 mt-2">
                                    Add some items to get started
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    cart.map((item, index) => {
                        const price = item.price || 0;
                        const quantity = item.quantity || 0;
                        const name = item.name || 'Unknown Product';
                        const image = item.image || '';

                        return (
                            <div
                                key={item.productId}
                                className="w-full max-w-4xl mx-4 mb-6 relative transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animation: 'slideInUp 0.6s ease-out forwards'
                                }}
                            >
                                {/* Gradient Border */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-2xl blur opacity-60"></div>

                                {/* Card Content */}
                                <div className="bg-white backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden relative z-10">
                                    <div className="flex items-center p-6 relative">
                                        {/* Product Image */}
                                        <div className="relative group">
                                            <img
                                                src={image}
                                                alt={name}
                                                className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-image.png';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-300"></div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 ml-6">
                                            <h3 className="font-bold text-xl text-gray-900 mb-2">{name}</h3>
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-semibold text-blue-600">
                                                    Rs.{price.toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </span>
                                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                    per item
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 mx-6">
                                            <button
                                                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                                                onClick={() => {
                                                    addToCart(item, -1);
                                                    updateCart();
                                                }}
                                            >
                                                −
                                            </button>
                                            <div className="w-16 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                                                <span className="font-bold text-lg text-gray-900">{quantity}</span>
                                            </div>
                                            <button
                                                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                                                onClick={() => {
                                                    addToCart(item, 1);
                                                    updateCart();
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right mr-6">
                                            <div className="text-2xl font-bold text-gray-900">
                                                Rs.{(quantity * price).toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105 group"
                                            onClick={() => {
                                                addToCart(item, -quantity);
                                                updateCart();
                                            }}
                                            title="Remove item"
                                        >
                                            <TbTrash className="text-xl group-hover:scale-110 transition-transform duration-200" />
                                        </button>
                                    </div>

                                    {/* Bottom border */}
                                    <div className="h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Summary Section with Gradient Border */}
                {cart.length > 0 && (
                    <div className="w-full max-w-4xl mx-4 mt-8 relative">
                        {/* Gradient Border */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-2xl blur opacity-60"></div>

                        <div className="relative z-10 bg-white backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-200/50 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="text-lg font-semibold text-gray-800">
                                            {cart.length} item{cart.length !== 1 ? 's' : ''}
                                        </div>
                                        <div className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full inline-block">
                                            Total items: {cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600 mb-1">Grand Total</div>
                                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            Rs.{getTotal().toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Checkout Button */}
                {cart.length > 0 && (
                    <div className="w-full max-w-4xl mx-4 mt-6 flex justify-end">
                        <button
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
                            onClick={() => {
                                navigate("/checkout", { state: { items: cart } });
                            }}
                        >
                            <span className="flex items-center gap-2">
                                Proceed to Checkout
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
