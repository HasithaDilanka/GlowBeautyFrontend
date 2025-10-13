import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddUserAdminPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");  // Default value
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                role: role
            };

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required. Please login again.");
                window.location.href = "/login";
                return;
            }

            const response = await axios.post(
                "http://localhost:3000/api/users/register",
                userData,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("User added successfully!", response.data);
            toast.success("User added successfully!");
            navigate("/admin/users");

        } catch (error) {
            console.error("Error adding user:", error);

            if (error.response) {
                // Server responded with error
                const errorMessage = error.response.data?.message || "Failed to add user";
                toast.error(errorMessage);
            } else if (error.request) {
                // Network error
                toast.error("Network error. Please check your connection.");
            } else {
                // Other error
                toast.error("Failed to add user. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-[800px] min-h-screen flex items-center justify-center p-4">
            <div className="bg-white opacity-95 p-6 rounded-2xl shadow-2xl border border-gray-400">
                <h1 className="text-2xl font-bold mb-5 text-blue-700">
                    Add New User
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
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300"
                            required
                            minLength="6"
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
                            {isSubmitting ? "Adding User..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}