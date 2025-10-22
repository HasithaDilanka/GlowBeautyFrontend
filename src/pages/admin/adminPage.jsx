// File: AdminPage.jsx

import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBoxOpen, FaCube, FaRegComment, FaRegUser, FaSignOutAlt } from "react-icons/fa";
import { MdBorderColor, MdDashboard } from "react-icons/md";
import React, { useState, useEffect } from "react";

// Import your existing components
import ProductAdminPage from "./productAdmin";
import AddProductAdminPage from "./addProductAdminPage";
import UpdateProductAdminPage from "./updateProduct";
import OrdersPage from "./ordersPage";

// Import the new user management components
import AddUserAdminPage from "./addUserAdminPage";
import EditUserAdminPage from "./editUserAdminPage";

import { FaTruckFast } from "react-icons/fa6";
import UserManagement from "./userManagement";
import Chart1 from "../../components/chart_1";
import Chart2 from "../../components/chart_2";
import Messages from "./customerMessages";
import { icon } from "leaflet";
import Loader from "../../components/loader";
import axios from "axios";


// Import Charts

// Dashboard Component with API integration
function PanelCard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get token from localStorage

      const response = await fetch(
        "http://localhost:3000/api/dashboard/stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }

      const data = await response.json();
      setDashboardStats(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Quick Actions Section */}
      <div className="mb-5">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/newProduct"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <FaBoxOpen className="mr-2" />
            Add Product
          </Link>
          <Link
            to="/admin/newUser"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <FaRegUser className="mr-2" />
            Add User
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
          >
            <MdBorderColor className="mr-2" />
            View Orders
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center"
          >
            <FaRegUser className="mr-2" />
            Manage Users
          </Link>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Refresh Stats
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        {/* Total Product Count Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-[240px] h-33 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Products Count
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {dashboardStats.totalProducts}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Active products in store
              </p>
            </div>
            <div className="p-4 rounded-full bg-blue-100">
              <FaBoxOpen className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-[240px] h-33 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold text-green-600">
                {dashboardStats.totalUsers}
              </p>
              <p className="text-xs text-gray-500 mt-1">Registered customers</p>
            </div>
            <div className="p-4 rounded-full bg-green-100">
              <FaRegUser className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-[240px] h-33 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {dashboardStats.totalOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time orders</p>
            </div>
            <div className="p-4 rounded-full bg-purple-100">
              <FaCube className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-[240px] h-33 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Pending Orders
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {dashboardStats.pendingOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Orders awaiting processing
              </p>
            </div>
            <div className="p-4 rounded-full bg-orange-100">
              <FaTruckFast className="text-2xl text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="  flex grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Chart1 />
        <Chart2 />
      </div>
    </div>
  );
}
export default function AdminPage() { 

  const navigate = useNavigate();

  const location = useLocation();

  const [adminValidated, setAdminValiadated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("you are not logged in");
      navigate("/login");
    } else {
      axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }).then((response) => {
        if (response.data.role === "admin") {
          setAdminValiadated(true);
        } else {
          toast.error("You are not authorized");
          navigate("/login");
        }
      }).catch((error) => {
        toast.error("You are not authorized");
        navigate("/login");
      });
    }
  }, []);





  const menuItems = [
    { path: "/admin", icon: MdDashboard, label: "Dashboard", exact: true },
    { path: "/admin/products", icon: FaBoxOpen, label: "Products" },
    { path: "/admin/orders", icon: MdBorderColor, label: "Orders" },
    { path: "/admin/users", icon: FaRegUser, label: "Users" },
    { path: "/admin/messages", icon: FaRegComment, label: "Messages" },
  ];

  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-screen flex bg-gray-50">
      {adminValidated ? <>
        <div className="w-[280px] h-full bg-white shadow-xl border-r border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3">
                <img
                  className="w-12 h-12 text-white"
                  src="src/assets/logo.png"
                  alt="Logo"
                />
              </div>
              Admin Panel
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="py-4 px-3">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.path, item.exact);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                  `}
                  >
                    <Icon
                      className={`
                      mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive
                          ? "text-blue-700"
                          : "text-gray-400 group-hover:text-gray-500"
                        }
                    `}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Section */}
          <div className="absolute bottom-0 w-[280px] p-4 border-t border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-2">
                <FaRegUser className="text-gray-600 text-sm" />
              </div>
              <Link
                to="/adminProfile"
                className="text-blue-500 hover:text-blue-600 ml-3"
              >
                <p className="text-sm font-medium text-gray-700">Profile</p>

              </Link>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <Routes path="/*">
            <Route path="/" element={<PanelCard />} />
            <Route path="/products" element={<ProductAdminPage />} />
            <Route path="/newProduct" element={<AddProductAdminPage />} />
            <Route path="/updateProduct" element={<UpdateProductAdminPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/newUser" element={<AddUserAdminPage />} />
            <Route path="/editUser" element={<EditUserAdminPage />} />
            <Route path="/messages" element={<Messages />} />

          </Routes>
        </div>
      </> : <Loader />}
    </div>
  );
}
