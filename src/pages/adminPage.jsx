import { Link, Route, Routes } from "react-router-dom";

import { FaBoxOpen, FaRegUser } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

export default function AdminPage() {
    
    return (
        <div className="w-full h-screen flex bg-gradient-to-r from-red-100 to-red-500">
            <div className="w-[300px] h-full bg-white"> 
                <p className="text-black-800 text-2xl p-5 justify-center items-center flex text-blue-800 font-bold">Admin Panel</p>

                <Link  to="/admin/products" className="p-4 text-black flex justify-start items-center text-xl hover:bg-blue-200"><FaBoxOpen className="mx-5 size-6"/>Products</Link>
                <Link to="/admin/orders" className="p-4 text-black flex justify-start items-center text-xl hover:bg-blue-200"><MdBorderColor className="mx-5 size-6"/>Orders</Link>
                <Link to="/admin/users" className="p-4 text-black flex justify-start items-center text-xl hover:bg-blue-200"><FaRegUser className="mx-5 size-6"/>Users</Link>
                <Link to="/admin/settings" className="p-4 text-black flex justify-start items-center text-xl hover:bg-blue-200"><IoMdSettings  className="mx-5 size-6"/>Settings</Link>

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

