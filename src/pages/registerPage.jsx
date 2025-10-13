import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function register(e) {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users/register",
                {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }
            );

            toast.success("Account created successfully!");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 w-full max-w-xs border border-white/20 mx-4">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-1">Create Account</h1>
                        <p className="text-white/70 text-xs">Join us today</p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={register} className="space-y-3">
                        <div>
                            <label htmlFor="firstName" className="block text-xs font-medium text-white/90 mb-1">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                placeholder="Enter first name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-xs font-medium text-white/90 mb-1">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                placeholder="Enter last name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-white/90 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-white/90 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                placeholder="Create password"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-xs font-medium text-white/90 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                placeholder="Confirm password"
                                required
                            />
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="text-xs text-white/70">
                                Password strength: {password.length < 6 ?
                                    <span className="text-red-300">Weak</span> :
                                    password.length < 10 ?
                                        <span className="text-yellow-300">Good</span> :
                                        <span className="text-green-300">Strong</span>
                                }
                            </div>
                        )}

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg text-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Creating...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-4">
                        <p className="text-center text-xs text-white/70">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-pink-300 hover:text-pink-200 transition duration-200">
                                Sign in
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}