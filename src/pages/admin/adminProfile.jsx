import { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, Shield, LogOut, Save, X } from "lucide-react";
import Navbar from "../../components/nav";
import Footer from "../../components/footer";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    // Safely get token with error handling
    const getToken = () => {
        try {
            return localStorage.getItem("token");
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            return null;
        }
    };

    // Fetch user data
    useEffect(() => {
        async function fetchUser() {
            try {
                const token = getToken();
                if (!token) {
                    setError("No authentication token found");
                    setLoading(false);
                    return;
                }
                
                const res = await axios.get("http://localhost:3000/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (res.data) {
                    setUser(res.data);
                    setFormData({
                        firstName: res.data.firstName || "",
                        lastName: res.data.lastName || "",
                        email: res.data.email || "",
                        password: "",
                    });
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setError("Failed to load user profile");
                if (error.response?.status === 401 || error.response?.status === 403) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    // Handle form change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (message) setMessage("");
        if (error) setError("");
    };

    // Update profile - Fixed to work with your backend
    const handleUpdate = async () => {
        try {
            const token = getToken();
            if (!token) {
                setMessage("Authentication token not found");
                return;
            }

            // Since your JWT doesn't include _id, we need to find the user by email first
            // or modify the approach to work with your current setup
            
            // Prepare update data - only include fields that have values
            const updateData = {};
            if (formData.firstName.trim()) updateData.firstName = formData.firstName.trim();
            if (formData.lastName.trim()) updateData.lastName = formData.lastName.trim();
            if (formData.email.trim()) updateData.email = formData.email.trim();
            if (formData.password.trim()) updateData.password = formData.password.trim();

            console.log("User email for update:", user?.email);
            console.log("Update data:", updateData);

            // First, find the user by email to get the _id
            const userResponse = await axios.get(`http://localhost:3000/api/users/email/${user.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!userResponse.data?._id) {
                // If the above doesn't work, try a different approach
                // Make a PUT request directly with email in the URL instead of ID
                const res = await axios.put(
                    `http://localhost:3000/api/users/email/${user.email}`,
                    updateData,
                    { 
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        } 
                    }
                );
                
                if (res.data) {
                    setUser(res.data);
                    setMessage("Profile updated successfully!");
                    setEditing(false);
                    setFormData(prev => ({ ...prev, password: "" }));
                    setTimeout(() => setMessage(""), 3000);
                }
            } else {
                // Use the _id we got from the email lookup
                const res = await axios.put(
                    `http://localhost:3000/api/users/${userResponse.data._id}`,
                    updateData,
                    { 
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        } 
                    }
                );
                
                if (res.data) {
                    setUser(res.data);
                    setMessage("Profile updated successfully!");
                    setEditing(false);
                    setFormData(prev => ({ ...prev, password: "" }));
                    setTimeout(() => setMessage(""), 3000);
                }
            }
        } catch (error) {
            console.error("Update failed: ", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            if (error.response?.data?.message) {
                setMessage(`Update failed: ${error.response.data.message}`);
            } else if (error.response?.status === 404) {
                setMessage("User not found in database. Please try logging in again.");
            } else if (error.response?.status === 401) {
                setMessage("Session expired. Please log in again.");
                setTimeout(() => handleLogout(), 2000);
            } else {
                setMessage("Failed to update profile. Please check your connection and try again.");
            }
        }
    };



    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                        <p className="mt-4 text-gray-600 text-lg">Loading your profile...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error || !user) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
            
                <div className="flex-1 flex justify-center items-center">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile Error</h3>
                        <p className="text-red-600 mb-6">{error || "User not found"}</p>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
                
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
           

            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your account information</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header Section with Gradient */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
                         
                        </div>

                        {/* Profile Content */}
                        <div className="px-8 pb-8 -mt-16 relative">
                            {/* Profile Image - No Edit Functionality */}
                            <div className="flex justify-center mb-6">
                                <img
                                    src={user.image || "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                    onError={(e) => {
                                        e.target.src = "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png";
                                    }}
                                />
                            </div>

                            {/* Success/Error Messages */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
                                    message.includes("successfully") 
                                        ? "bg-green-50 text-green-700 border border-green-200" 
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                    {message}
                                </div>
                            )}

                            {/* Profile Display Mode */}
                            {!editing && (
                                <div className="space-y-6">
                                    {/* Name and Role */}
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                            {user.firstName} {user.lastName}
                                        </h2>
                                        <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                                            {user.role}
                                        </span>
                                    </div>

                                    {/* User Details Grid */}
                                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Mail className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                                    <p className="text-gray-800 font-medium">{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Phone className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                                    <p className="text-gray-800 font-medium">
                                                        {user.phone && user.phone !== "NOT GIVEN" ? user.phone : "Not provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <Shield className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Email Status</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${user.isEmailVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        <span className={`font-medium ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                                                            {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <User className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Account Status</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                                        <span className={`font-medium ${user.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Edit Button */}
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={() => {
                                                setEditing(true);
                                                setMessage("");
                                                setError("");
                                            }}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                                        >
                                            Update Information
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Edit Form Mode */}
                            {editing && (
                                <div className="space-y-6">
                                    {/* Edit Header */}
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Update Profile</h3>
                                        <p className="text-gray-600">Modify your account information</p>
                                    </div>

                                    {/* Messages */}
                                    {message && (
                                        <div className={`p-4 rounded-xl text-center font-medium ${
                                            message.includes("successfully") 
                                                ? "bg-green-50 text-green-700 border border-green-200" 
                                                : "bg-red-50 text-red-700 border border-red-200"
                                        }`}>
                                            {message}
                                        </div>
                                    )}

                                    {/* Form Fields */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    placeholder="Enter your first name"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Leave blank to keep current password"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Enter your last name"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>

                                            {/* Verification Status Info */}
                                            <div className="p-4 bg-gray-50 rounded-xl mt-4">
                                                <p className="text-sm text-gray-600 mb-2">Current Status</p>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Shield className="w-4 h-4 text-purple-500" />
                                                        <span className={user.isEmailVerified ? "text-green-600" : "text-red-600"}>
                                                            Email {user.isEmailVerified ? "Verified" : "Not Verified"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="w-4 h-4 text-indigo-500" />
                                                        <span className={user.isBlocked ? "text-red-600" : "text-green-600"}>
                                                            Account {user.isBlocked ? "Blocked" : "Active"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-center gap-4 mt-8">
                                        <button
                                            onClick={handleUpdate}
                                            disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()}
                                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditing(false);
                                                setMessage("");
                                                setError("");
                                                // Reset form data
                                                setFormData({
                                                    firstName: user.firstName || "",
                                                    lastName: user.lastName || "",
                                                    email: user.email || "",
                                                    password: "",
                                                });
                                            }}
                                            className="flex items-center gap-2 px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-600 transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}