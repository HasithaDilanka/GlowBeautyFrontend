import { Link } from "react-router-dom";

export default function Header() {

    return (
        <header className="bg-blue-700 text-white p-4 ">
            <div className="container mx-auto flex justify-center items-center text-xl">
                    <header className="flex space-x-6">
                        <Link to="/" className="hover:underline">Home</Link>
                        <Link to="/product" className="hover:underline">Product</Link>
                        <Link to="/reviews" className="hover:underline">Reviews</Link>
                        <Link to="/contactUs" className="hover:underline">Contact Us</Link>
                    </header>
            </div>
        </header>

    );
}