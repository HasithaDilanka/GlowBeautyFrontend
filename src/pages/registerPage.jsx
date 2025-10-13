import { useState } from "react";

export default function RegisterPage() {

    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="bg-[url(./register-bg.jpg)] bg-cover bg-center min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
            <div className="rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition duration-500 hover:scale-105 opacity-90 backdrop-blur-xl">

                <h1 className="text-4xl font-bold text-center text-white mb-6">Sign Up</h1>

                <form>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-semibold mb-2">Username</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-transparent text-white placeholder-white focus:outline-none focus:ring-2"
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white text-sm font-semibold mb-2">Email</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-transparent text-white placeholder-white focus:outline-none focus:ring-2"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white text-sm font-semibold mb-2">Password</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-transparent text-white placeholder-white focus:outline-none focus:ring-2"
                            id="password"
                            type="password"
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-white text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-transparent text-white placeholder-white focus:outline-none focus:ring-2"
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                console.log("Confirm password updated");
                            }}
                        />
                    </div>

                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2"
                        type="button"
                    > Create Account
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-white">
                    Already have an account?{" "}
                    <a href="#" className="text-blue-400 hover:underline">Sign in</a>
                </p>
            </div>
        </div>
    );
}
