import { Route, Routes } from "react-router-dom";

export default function AdminPage() {
    return (
        <div className="w-full h-screen flex bg-gradient-to-r from-red-100 to-red-500">
            <div className="w-[300px] h-full bg-white">
                <p className="text-black-800 text-2xl p-5">Welcome..!</p>
            </div>
            <div className="w-[calc(100%-300px)] bg-gradient-to-r from-blue-300 to-blue-600 h-full flex">
                <Routes path="/*">
                    <Route path="/" element={<p className="text-white text-2xl p-5">Admin Dashboard</p>} />
                    <Route path="/products" element={<p className="text-white text-2xl p-5">Manage Products</p>} />
                    <Route path="/orders" element={<p className="text-white text-2xl p-5">Manage Orders</p>} /> 
                </Routes>
            </div>
        </div>
    )
}

