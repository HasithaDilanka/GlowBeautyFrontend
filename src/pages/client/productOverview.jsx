import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader";
import ImageSlider from "../../components/imageSlider";
import toast from "react-hot-toast";
import { addToCart } from "../../utils/cart";

export default function ProductOverViewPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        if (status === "loading") {
            axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
                .then((res) => {
                    setProduct(res.data);
                    setStatus("success");
                })
                .catch(() => {
                    setStatus("error");
                });
        }
    }, [status, productId]);

    if (status === "loading") {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <Loader />
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-red-50 text-red-700 text-lg font-semibold">
                ⚠ Error loading product. Please try again later.
            </div>
        );
    }

    const handleQtyChange = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };


    const totalPrice = product.price * quantity;

    return (
        <div className="w-full min-h-screen bg-gray-50 py-2 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Main Content */}
                <div className="bg-white rounded-lg overflow-hidden flex flex-row">
                    {/* Image Section */}
                    <div className="w-1/2 bg-gray-50 p-6 flex justify-center items-center border-r border-gray-100 min-h-[600px]">
                        <div className="w-full h-full flex justify-center items-center overflow-hidden">
                            <ImageSlider images={product.images} />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-1/2 p-8 lg:p-12 flex flex-col justify-between gap-8">
                        {/* Title & Tags */}
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold text-gray-900 leading-snug">
                                {product.name}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                {product.altNames.map((alt, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                                    >
                                        {alt}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-lg leading-relaxed font-light">
                            {product.description}
                        </p>

                        {/* Features */}
                        {product.features?.length > 0 && (
                            <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                                {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        )}

                        {/* Price */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 space-y-2">
                            <div className="flex items-baseline gap-4">
                                {product.labelledPrice > product.price && (
                                    <span className="text-xl font-semibold text-gray-400 line-through">
                                        Rs.{" "}
                                        {product.labelledPrice.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                )}
                                <span className="text-3xl font-bold text-green-700">
                                    Rs.{" "}
                                    {product.price.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                                {product.labelledPrice > product.price && (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                                        {Math.round(
                                            ((product.labelledPrice - product.price) /
                                                product.labelledPrice) *
                                                100
                                        )}
                                        % OFF
                                    </span>
                                )}
                            </div>

                            {/* Total Price */}
                            <div className="text-lg font-medium text-gray-800">
                                Total ({quantity} × Rs. {product.price.toFixed(2)}):{" "}
                                <span className="font-bold text-blue-700">
                                    Rs.{" "}
                                    {totalPrice.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-gray-700">
                                    Quantity:
                                </span>
                                <div className="flex items-center border rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => handleQtyChange(-1)}
                                        className="w-10 h-10 bg-gray-100 text-lg font-bold hover:bg-gray-200"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => handleQtyChange(1)}
                                        className="w-10 h-10 bg-gray-100 text-lg font-bold hover:bg-gray-200"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row sm:flex-row gap-4 mt-6">
                            {/* Add to Cart */}
                            <button
                                className="flex-1 h-12 bg-blue-600 text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 border-2 border-blue-600 transition duration-300"
                                onClick={() => {
                                    addToCart(product, quantity);
                                    toast.success(
                                        `Product added to cart! (${quantity} items)`
                                    );
                                    console.log(
                                        "Product added to cart:",
                                        product.name,
                                        "Quantity:",
                                        quantity
                                    );
                                }}
                            >
                                Add to Cart
                            </button>

                            {/* Buy Now */}
                            <button
                                className="flex-1 h-12 bg-green-600 text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 border-2 border-green-600 transition duration-300"
                                onClick={() => {
                                    navigate("/checkout", {
                                        state: {
                                            items: [
                                                {
                                                    productId: product.productId,
                                                    quantity: quantity,
                                                    name: product.name,
                                                    price: product.price,
                                                    image: product.images[0],
                                                },
                                            ],
                                        },
                                    });
                                }}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}