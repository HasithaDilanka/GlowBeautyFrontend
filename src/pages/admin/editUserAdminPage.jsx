import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditUserAdminPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const userId = location.state?.userId || new URLSearchParams(location.search).get('id');
    const userData = location.state?.userData;

    useEffect(() => {
        if (userId) {
            if (userData) {
                setFirstName(userData.firstName || "");
                setLastName(userData.lastName || "");
                setEmail(userData.email || "");
                setRole(userData.role || "user");
                setLoading(false);
            } else {
                fetchUserData();
            }
        } else {
            toast.error("No user ID provided");
            navigate("/admin/users");
        }
    }, [userId, userData]);

    async function fetchUserData() {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required. Please login again.");
                window.location.href = "/login";
                return;
            }

            const response = await axios.get(
                "http://localhost:3000/api/users/all",
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                }
            );

            const users = response.data;
            const user = users.find(u => u._id === userId);

            if (user) {
                setFirstName(user.firstName || "");
                setLastName(user.lastName || "");
                setEmail(user.email || "");
                setRole(user.role || "user");
            } else {
                toast.error("User not found");
                navigate("/admin/users");
                return;
            }

        } catch (error) {
            console.error("Error fetching user data:", error);

            if (error.response?.status === 404) {
                toast.error("User not found");
            } else if (error.response?.status === 401) {
                toast.error("Authentication failed. Please login again.");
                window.location.href = "/login";
                return;
            } else {
                toast.error("Failed to load user data. Please try again.");
            }
            navigate("/admin/users");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role
            };

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required. Please login again.");
                window.location.href = "/login";
                return;
            }

            const response = await axios.put(
                `http://localhost:3000/api/users/${userId}`,
                userData,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("User updated successfully!", response.data);
            toast.success("User updated successfully!");
            navigate("/admin/users");

        } catch (error) {
            console.error("Error updating user:", error);

            if (error.response) {
                const errorMessage = error.response.data?.message || "Failed to update user";
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("Failed to update user. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="w-[800px] min-h-screen flex items-center justify-center p-4">
                <div className="bg-white opacity-95 p-6 rounded-2xl shadow-2xl border border-gray-400">
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading user data...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[800px] min-h-screen flex items-center justify-center p-4">
            <div className="bg-white opacity-95 p-6 rounded-2xl shadow-2xl border border-gray-400">
                <h1 className="text-2xl font-bold mb-5 text-blue-700">
                    Edit User
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-semibold mb-1">
                            User Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300"
                            required
                            disabled={isSubmitting}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>


                    <div className="col-span-2 mt-4 flex justify-between"></div>
                    <div className="col-span-1 mt-3">
                        <Link
                            to="/admin/users"
                            className="bg-black text-white py-2 w-[230px] rounded-lg text-center inline-block hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>

                    <div className="col-span-1 mt-3">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 w-full rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating User..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
