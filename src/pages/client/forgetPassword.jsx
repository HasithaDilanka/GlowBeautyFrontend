import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, CheckCircle, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

export default function ForgetPassword() {
    const [email, setEmail] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const navigate = useNavigate()

    async function sendOTP() {
        if (!email) return toast.error("Please enter your email")
        try {
            setIsLoading(true)
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`, { email })
            toast.success("OTP sent successfully")
            setEmailSent(true)
        } catch {
            toast.error("Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
    }

    async function resetPassword() {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/reset-password", {
                email: email,
                otp: otp,
                newPassword: newPassword
            })
            toast.success("Password reset successfully")
            navigate("/login")
        } catch {
            toast.error("Failed to reset password")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex justify-center items-center p-4 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-70 animate-pulse delay-200"></div>
            <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-70 animate-pulse delay-500"></div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 w-full max-w-xs border border-white/20 my-4 mx-4">

                    {!emailSent ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <Lock className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-white mb-1">Forgot Password?</h1>
                                <p className="text-white/70 text-xs">
                                    Enter your email and we'll send you a reset link.
                                </p>
                            </div>

                            {/* Input + Button */}
                            <div className="space-y-6">
                                <div className="relative">
                                
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                    />
                                </div>

                                <button
                                    onClick={sendOTP}
                                    disabled={!email || isLoading}
                                    className="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg text-sm"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </button>
                            </div>

                            {/* Back to login */}
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-gray-300 hover:text-white flex items-center justify-center mx-auto text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to Login
                                </button>
                            </div>
                        </>


                    ) : (


                        // OTP + Reset Password
                        <div className="text-center animate-fadeIn">
                            <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white mb-1">Check Your Email!</h1>
                            <p className="text-white/70 text-xs mb-4">
                                We've sent a reset code to <br />
                                <span className="text-purple-300 font-semibold">{email}</span>
                            </p>

                            <div className="space-y-4 text-left">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                />
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200 placeholder-white/50 text-white backdrop-blur-sm text-sm"
                                />
                            </div>

                            <button
                                onClick={resetPassword}
                                className="mt-6 w-full mx-auto text-sm py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl"
                            >
                                
                                Reset Password
                            </button>

                            <button
                                onClick={sendOTP}
                                className="mt-4 w-full mx-auto text-sm py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
                            >
                                Resend OTP
                            </button>

                              <button
                                    onClick={() => navigate("/login")}
                                    className="text-gray-300 mt-4 hover:text-white flex items-center justify-center mx-auto text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to Login
                                </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Animations */}
            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
