import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit, BiPencil, BiTrash } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";

export default function ProductAdminPage() {
    // Initialize with empty array instead of sample data
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // New state for filtered products
    const [selectedCategory, setSelectedCategory] = useState("All"); // New state for selected category
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(0); // auto refresh trigger

    const navigate = useNavigate();

    // Category options
    const categories = ["All", "Cream", "Face Wash", "Power", "Serum", "Lipstick"];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");

                // Set up headers if token exists
                const headers = token ? {
                    Authorization: `Bearer ${token}`
                } : {};

                const response = await axios.get(
                    import.meta.env.VITE_BACKEND_URL + "/api/products",
                    { headers }
                );

                console.log("API Response:", response.data); // Debug log

                // Check if response.data is an array
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                    setFilteredProducts(response.data); // Initialize filtered products
                } else if (response.data && Array.isArray(response.data.products)) {
                    // In case the API returns { products: [...] }
                    setProducts(response.data.products);
                    setFilteredProducts(response.data.products); // Initialize filtered products
                } else {
                    console.warn("API response is not in expected format:", response.data);
                }

            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);

                // Show error toast
                toast.error("Failed to load products from server.");
                
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isLoading]); // dependency array

    // Filter products based on selected category
    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => 
                product.category === selectedCategory
            );
            setFilteredProducts(filtered);
        }
    }, [selectedCategory, products]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.delete(
                import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Product deleted successfully");
            setIsLoading(isLoading + 1); // Trigger re-fetch

        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete product");
        }
    };

    if (loading) {
        return (
            <Loader/>
        );
    }

    return (
        <div className="w-full h-full">
            <h1 className="text-2xl font-bold mb-4 pt-5 pl-3">Product List</h1>

            {error && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 mx-3">
                    <strong>Warning:</strong> {error}.
                </div>
            )}

            {/* Category Filter Buttons */}
            <div className="px-3 mb-4">
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                selectedCategory === category
                                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                
              
            </div>

            <div className="overflow-x-auto p-3">
                <div className="max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 shadow-lg text-center">
                    <table className="min-w-full table-auto">
                        <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[16px] font-semibold">
                            <tr>
                                <th className="p-3">Image</th>
                                <th className="p-3">Product ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Labelled Price</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-gray-500">
                                        {selectedCategory === "All" 
                                            ? "No products found" 
                                            : `No products found in ${selectedCategory} category`
                                        }
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr key={product.productId || index} className="hover:bg-gray-50">
                                        <td className="p-3 text-center">
                                            <img
                                                src={product.images?.[0] || "/images/placeholder.jpg"}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded shadow-sm mx-auto"
                                                onError={(e) => {
                                                    e.target.src = "/images/placeholder.jpg";
                                                }}
                                            />
                                        </td>
                                        <td className="p-3 text-gray-700 object-cover">{product.productId}</td>
                                        <td className="p-3 text-gray-700">{product.name}</td>
                                        <td className="p-3 text-green-600 font-medium">Rs.{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-gray-600 line-through">Rs.{product.labelledPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-3 text-gray-700">{product.stock}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                product.category === selectedCategory && selectedCategory !== "All"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}>
                                                {product.category}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            {/* delete button */}
                                            <button
                                                className="text-red-500 text-xl items-center text-center cursor-pointer hover:text-red-700 transition-colors p-3"
                                                onClick={() => handleDeleteProduct(product.productId)}
                                            >
                                                <BiTrash />
                                            </button>

                                            {/* update button */}
                                            <button
                                                className="text-blue-500 text-xl items-center text-center cursor-pointer hover:text-blue-700 transition-colors p-3"
                                                onClick={() => navigate("/admin/updateProduct", {
                                                    state: product
                                                })}
                                            >
                                                <BiEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Link
                to="/admin/newProduct"
                className="fixed right-[60px] bottom-[60px] bg-blue-800 font-bold text-white p-2 rounded-full shadow-md cursor-pointer inline-block hover:scale-110 transition-transform"
            >
                <PiPlus className="text-white text-3xl" />
            </Link>
        </div>
    );
}