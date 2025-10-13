import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

    const [password, setPassword] = useState("");                     // useState hook is used to create state variables in functional components
    const [email, setEmail] = useState("");                   // useState hook is used to create state variables in functional components

    const navigate = useNavigate();                    // useNavigate hook is used to programmatically navigate to different routes in the application

    function login() {

        console.log(email, password)
        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/login", {
            email: email,
            password: password

        }).then((response) => {
            console.log(response.data);

            localStorage.setItem("token", response.data.token);  // Store the token in local storage for future requests

           // const token = localStorage.getItem("token");  // passe kiyavanava nn token eka local storage ekata set karala thiyenn

            toast.success("Login successful!");

            if (response.data.role === "admin") {
                // Redirect to admin page
                navigate("/admin");         //user admin kenek nn kelinma admin page ekata yavanava
            } else if (response.data.role === "user") {
                // Redirect to user page
                navigate("/");
            }
        }).catch((e) => {
            console.error("There was an error logging in!", e);
            toast.error("Login failed. Please try again.");
        });
    }

    return (
        <div className=" bg-[url(./login-bg.jpg)] bg-cover bg-center min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
            <div className="rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition duration-500 hover:scale-105 opacity-90 backdrop-blur-xl">

                <h1 className="text-4xl font-bold text-center text-white mb-6">Login</h1>

                <form>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-semibold mb-2">Email</label>
                        <input

                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}

                            className="w-full px-4 py-2 rounded-lg border bg-transparent text-white placeholder-white focus:outline-none focus:ring-2"
                            id="email"
                            type="text"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-white text-sm font-semibold mb-2">Password</label>
                        <input

                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}

                            className="w-full px-4 py-2 rounded-lg border bg-transparent text-white placeholder-white focus:outline-none focus:ring-2"
                            id="password"
                            type="password"
                            placeholder="Enter your password" />
                    </div>

                    <button
                        onClick={login}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2"
                        type="button">Sign In</button>
                </form>

                <p className="mt-4 text-sm text-center text-white">
                    Don't have an account?{" "}
                    <a href="#" className="text-blue-400 hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
}
