import { useEffect, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { ShoppingCartIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to access checkout");
            navigate("/login");
            return;
        } else {
            const getUser = async () => {
                try {
                    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users", {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    setUser(response.data);
                    setName(response.data.firstName + " " + response.data.lastName);
                    setAddress(response.data.address || "");
                    setPhone(response.data.phone || "");
                } catch (error) {
                    toast.error("Failed to fetch user details. Please check your connection.");
                    setName("");
                    setAddress("");
                    setPhone("");
                }
            };
            getUser();
        }
    }, [navigate]);

    const [cart, setCart] = useState(location.state?.items || []);

    if (!location.state?.items) {
        toast.error("Please select items to checkout");
        navigate("/product");
        return null;
    }

    function getTotal() {
        return cart.reduce((total, item) => {
            const price = item.price || 0;
            const quantity = item.quantity || 0;
            return total + quantity * price;
        }, 0);
    }

    function getTotalItems() {
        return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }

    function getShipping() {
        const total = getTotal();
        return total > 5000 ? 0 : 250;
    }

    function getTax() {
        return getTotal() * 0.08;
    }

    function getFinalTotal() {
        return getTotal() + getShipping() + getTax();
    }

    const updateQuantity = (index, type) => {
        const updatedCart = [...cart];
        if (type === "increment") {
            updatedCart[index].quantity += 1;
        } else if (type === "decrement") {
            if (updatedCart[index].quantity > 1) updatedCart[index].quantity -= 1;
        }
        setCart(updatedCart);
    };

    async function placeOrder() {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to place an order");
            navigate("/login");
            return;
        }

        const order = {
            name,
            address,
            phone,
            items: cart.map(item => ({
                productId: item.productId,
                name: item.name || 'Unknown Product',
                image: item.image || '',
                price: item.price || 0,
                quantity: item.quantity || 1
            })),
            total: getFinalTotal()
        };

        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/orders", order, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            toast.success("Order placed successfully");
            setCart([]);
            navigate("/product");
        } catch (error) {
            console.error("Order placement error:", error);
            if (error.response) {
                toast.error(`Error: ${error.response.data?.message || "Failed to place order"}`);
            } else if (error.request) {
                toast.error("No response from server. Please check your connection.");
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    const removeItem = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        toast.success("Item removed from checkout");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
            <div className="container mx-auto px-4 py-12">
                {cart.length === 0 ? (
                    <div className="w-full max-w-4xl mx-auto h-64 flex flex-col justify-center items-center">
                        <ShoppingCartIcon className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">Your checkout cart is empty.</p>
                        <button
                            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                            onClick={() => navigate("/product")}
                        >
                            Go to Products
                        </button>
                    </div>
                ) : (
                    <div className="flex-cols-2 lg:grid-cols-3 gap-20 max-w-7xl mx-auto flex justify-center">
                        {/* Left Side - Products Section */}
                        <div className="lg:col-span-2 w-2/3">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Items</h2>
                            <div className="space-y-6">
                                {cart.map((item, index) => {
                                    const { price = 0, quantity = 0, name = 'Unknown Product', image = '' } = item;

                                    return (
                                        <div key={index} className="relative transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                                            style={{ animationDelay: `${index * 0.1}s`, animation: 'slideInUp 0.6s ease-out forwards' }}
                                        >
                                            {/* Gradient Border */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-2xl blur opacity-60"></div>

                                            {/* Card Content */}
                                            <div className="bg-white backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200/50 overflow-hidden relative z-10">
                                                <div className="flex items-center p-6">
                                                    <div className="relative group">
                                                        <img src={image} alt={name} className="w-20 h-20 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300" onError={(e) => e.currentTarget.src = '/placeholder-image.png'} />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-300"></div>
                                                    </div>
                                                    <div className="flex-1 ml-4">
                                                        <h3 className="font-bold text-lg text-gray-900 mb-1">{name}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg font-semibold text-blue-600">Rs.{price.toFixed(2)}</span>
                                                            <span className="text-sm text-gray-500">x {quantity}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mx-4">
                                                        <button onClick={() => updateQuantity(index, "decrement")}
                                                            className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center font-bold shadow-md hover:shadow-lg transform hover:scale-105">−</button>
                                                        <div className="w-12 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                                                            <span className="font-bold text-sm text-gray-900">{quantity}</span>
                                                        </div>
                                                        <button onClick={() => updateQuantity(index, "increment")}
                                                            className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center font-bold shadow-md hover:shadow-lg transform hover:scale-105">+</button>
                                                    </div>
                                                    <div className="text-right mr-4">
                                                        <div className="text-lg font-bold text-gray-900">Rs.{(quantity * price).toFixed(2)}</div>
                                                    </div>
                                                    <button className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 group"
                                                        onClick={() => removeItem(index)}
                                                        title="Remove item"
                                                    >
                                                        <TbTrash className="text-lg group-hover:scale-110 transition-transform duration-200" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Side - Order Summary Section */}
                        <div className="lg:col-span-1 w-1/3">
                            <div className="sticky top-8 space-y-4">

                                {/* Shipping Details Card */}
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-2xl blur opacity-75"></div>
                                    <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 p-6 relative z-10 space-y-4">
                                        <h1 className="text-xl font-bold text-gray-900 mb-2">Enter Your Shipping Details</h1>
                                        {/* Name */}
                                        <input className="w-full pl-3 pr-4 py-3 rounded-lg bg-white/80 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all placeholder-gray-400"
                                            type="text" placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                        {/* Address */}
                                        <input className="w-full pl-3 pr-4 py-3 rounded-lg bg-white/80 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all placeholder-gray-400"
                                            type="text" placeholder="Enter Your Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                                        {/* Phone */}
                                        <input className="w-full pl-3 pr-4 py-3 rounded-lg bg-white/80 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all placeholder-gray-400"
                                            type="text" placeholder="Enter Your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                    </div>
                                </div>

                                {/* Order Summary Card */}
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-2xl blur opacity-75"></div>
                                    <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 p-6 relative z-10">
                                        <h2 className="text-xl font-bold text-gray-900 mb-3">Order Summary</h2>
                                        <div className="space-y-2 text-gray-700">
                                            <div className="flex justify-between">Items ({getTotalItems()})</div>
                                            <div className="flex justify-between">Rs.{getTotal().toFixed(2)}</div>
                                            <div className="flex justify-between">Shipping: {getShipping() === 0 ? "FREE" : `Rs.${getShipping().toFixed(2)}`}</div>
                                            <div className="flex justify-between">Tax: Rs.{getTax().toFixed(2)}</div>
                                            <div className="flex justify-between font-bold text-gray-900">Total: Rs.{getFinalTotal().toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={placeOrder}
                                    disabled={!name.trim() || !address.trim() || !phone.trim()}
                                >
                                    Place Order
                                </button>

                            </div>
                        </div>
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
