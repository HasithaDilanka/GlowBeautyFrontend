
import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import { isAdmin } from "./userController.js";

export async function getDashboardStats(req, res) {
    try {
        // Check if user is admin
        if (!isAdmin(req)) {
            return res.status(403).json({ message: "Access denied. Admin only" });
        }

        // Get total product count
        const totalProducts = await Product.countDocuments();

        // Get total user count (excluding admins)
        const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });

        // Get total order count
        const totalOrders = await Order.countDocuments();

        // Get pending order count
        const pendingOrders = await Order.countDocuments({ status: "Pending" });

        // Return dashboard statistics
        res.json({
            totalProducts,
            totalUsers,
            totalOrders,
            pendingOrders
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
}