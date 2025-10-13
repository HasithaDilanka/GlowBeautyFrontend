import axios from "axios";
import { useState, useEffect } from "react";
import ProductCard from "../../components/productCard";
import Paginator from "../../components/paginator"; // ✅ import paginator

// Loader component
const Loader = () => (
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
);

export default function ProductPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [freeShippingOnly, setFreeShippingOnly] = useState(false);

    // ✅ Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(8); // default items per page

    // Categories
    const categories = ["All", "Cream", "Face Wash", "Power","Serum", "Lipstick"];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let response;
                if (query.trim() === "") {
                    response = await axios.get(
                        import.meta.env.VITE_BACKEND_URL + "/api/products/"
                    );
                } else {
                    response = await axios.get(
                        import.meta.env.VITE_BACKEND_URL +
                        "/api/products/search/" +
                        encodeURIComponent(query.trim())
                    );
                }
                setAllProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    // Filter logic
    useEffect(() => {
        let products = allProducts;
        if (selectedCategory !== "All") {
            products = products.filter(
                (p) =>
                    p.category &&
                    p.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        if (freeShippingOnly) {
            products = products.filter((p) => p.price >= 5000);
        }
        setFilteredProducts(products);
        setCurrentPage(1); // ✅ Reset to first page when filters change
    }, [allProducts, selectedCategory, freeShippingOnly]);

    // ✅ Pagination slice
    const totalPages = Math.ceil(filteredProducts.length / limit) || 1;
    const startIndex = (currentPage - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
                {/* Sidebar */}
                <div className="w-60 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-100">
                        {/* Header: Our Products + Search */}
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Our Products
                            </h1>
                        </div>

                        {/* Search bar */}
                        <div className="relative mb-10">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <svg
                                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        {/* Categories */}
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Categories
                        </h2>
                        <div className="space-y-2 mb-6">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 border ${selectedCategory === category
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent"
                                            : "bg-gray-50 text-gray-700 hover:bg-indigo-50 border-gray-200"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-indigo-50 rounded-lg text-indigo-700 text-sm font-medium">
                            Products above Rs. 5000 enjoy Free Shipping
                        </div>

                        {/* Quick Stats */}
                        <div className="pt-4 border-t border-gray-200">
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Total Products</span>
                                    <span className="font-semibold text-indigo-600">
                                        {allProducts.length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Showing</span>
                                    <span className="font-semibold text-purple-600">
                                        {filteredProducts.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-64">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 min-[720px]:grid-cols-4 gap-6">
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product.productId} product={product} />
                                ))}
                            </div>

                            {/* ✅ Pagination component */}
                            {filteredProducts.length > 0 && (
                                <div className="mt-8">
                                    <Paginator
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                        limit={limit}
                                        setLimit={setLimit}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No products found for your selection.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
