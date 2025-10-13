import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import uploadFile from "../../utils/mediaUpload";

export default function UpdateProductAdminPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("Cream");
    const [alternativeNames, setAlternativeNames] = useState("");
    const [labelledPrice, setLabelledPrice] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [availability, setAvailability] = useState(true);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (location.state) {
            setProductId(location.state.productId || "");
            setProductName(location.state.name || "");
            setCategory(location.state.category || "Cream");
            setAlternativeNames(location.state.altNames ? location.state.altNames.join(",") : "");
            setLabelledPrice(location.state.labelledPrice || "");
            setPrice(location.state.price || "");
            setStock(location.state.stock || "");
            setAvailability(location.state.availability !== undefined ? location.state.availability : true);
            setDescription(location.state.description || "");
        }
    }, [location.state]);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const altNamesArray = alternativeNames
                .split(',')
                .map(name => name.trim())
                .filter(name => name.length > 0);

            let imageUrls = [];

            if (images && images.length > 0) {
                try {
                    const promisesArray = images.map(file => uploadFile(file));
                    imageUrls = await Promise.all(promisesArray);
                } catch (uploadError) {
                    console.error("Error uploading images:", uploadError);
                    toast.error("Failed to upload images. Please try again.");
                    setIsSubmitting(false);
                    return;
                }
            }

            const productData = {
                productId,
                name: productName,
                category,
                altNames: altNamesArray,
                labelledPrice: parseFloat(labelledPrice),
                price: parseFloat(price),
                stock: parseInt(stock),
                isAvailable: availability,
                images: imageUrls.length > 0 ? imageUrls : location.state.images,
                description,
            };

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required. Please login again.");
                window.location.href = "/login";
                return;
            }

            const response = await axios.put(
                import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId,
                productData,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Product updated successfully!", response.data);
            toast.success("Product updated successfully!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            if (error.response) {
                toast.error(error.response.data?.message || "Failed to update product");
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("Failed to update product. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-[800px] min-h-screen flex items-center justify-center p-4">
            <div className="bg-white opacity-95 p-6 rounded-2xl shadow-2xl border border-gray-400">
                <h1 className="text-2xl font-bold mb-5 text-blue-700">Update Product</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">Product ID</label>
                        <input
                            type="text"
                            value={productId}
                            disabled
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                        >
                            <option value="Cream">Cream</option>
                            <option value="Face Wash">Face Wash</option>
                            <option value="Power">Power</option>
                            <option value="Serum">Serum</option>
                            <option value="Lipstick">Lipstick</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-1">Alternative Names</label>
                        <input
                            type="text"
                            value={alternativeNames}
                            onChange={(e) => setAlternativeNames(e.target.value)}
                            placeholder="e.g. Alt1, Alt2"
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">Labelled Price</label>
                        <input
                            type="number"
                            step="0.01"
                            value={labelledPrice}
                            onChange={(e) => setLabelledPrice(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">Stock</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">Availability</label>
                        <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value === "true")}
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                            disabled={isSubmitting}
                        >
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </div>
                    <div className="col-span-3">
                        <label className="block text-sm font-semibold mb-1">Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setImages(Array.from(e.target.files))}
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg"
                        />
                        {images.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                {images.length} file(s) selected
                            </div>
                        )}
                    </div>
                    <div className="col-span-3">
                        <label className="block text-sm font-semibold mb-1">Description</label>
                        <textarea
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg resize-none"
                        ></textarea>
                    </div>
                    <div className="col-span-1 mt-3">
                        <Link
                            to="/admin/products"
                            className="bg-black text-white py-2 w-[230px] rounded-lg text-center inline-block hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                    <div className="col-span-2 mt-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white py-2 w-full rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Updating Product..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
