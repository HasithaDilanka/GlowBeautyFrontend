import express from "express";
import { createOrder, getOrders, updateOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Create order
orderRouter.post("/", createOrder);

// Get orders with pagination
orderRouter.get("/:page/:limit", getOrders);

// Update order
orderRouter.put("/:orderId", updateOrder);



export default orderRouter;
