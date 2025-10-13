import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            setIsLoading(true);
            try {
                const result = await axios.post(
                    import.meta.env.VITE_BACKEND_URL + "/api/users/google-login",
                    {
                        token: response.access_token
                    }
                );
                
                localStorage.setItem("token", result.data.token);
                toast.success("Login successful");
                
                if (result.data.role === "admin") {
                    navigate("/admin");
                } else if (result.data.role === "user") {
                    navigate("/");
                }
            } catch (error) {
                toast.error("Google login failed");
            } finally {
                setIsLoading(false);
            }
        }
    });

    async function login(e) {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users/login",
                {
                    email: email,
                    password: password
                }
            );

            localStorage.setItem("token", response.data.token);
            toast.success("Login successful!");

            if (response.data.role === "admin") {
                navigate("/admin");
            } else if (response.data.role === "user") {
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 w-full max-w-xs border border-white/20 my-4 mx-4">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-1">Welcome Back</h1>
                        <p className="text-white/70 text-xs">Sign in to your account</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={login} className="space-y-3">
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
                                placeholder="Enter your email"
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg text-sm"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/30"></div>
                            </div>
                           
                        </div>
                         <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-transparent text-white/70">Or continue with</span>
                            </div>

                        {/* Google Login Button */}
                        <button
                            type="button"
                            onClick={googleLogin}
                            disabled={isLoading}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-3 border border-white/20 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent flex items-center justify-center disabled:opacity-50 backdrop-blur-sm text-sm"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-4 space-y-2">
                        <p className="text-center text-xs text-white/70">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-pink-300 hover:text-pink-200 transition duration-200">
                                Sign up
                            </Link>
                        </p>
                        
                        <p className="text-center text-xs text-white/70">
                            Forgot your password?{" "}
                            <Link to="/forget" className="font-medium text-pink-300 hover:text-pink-200 transition duration-200">
                                Reset Password
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}