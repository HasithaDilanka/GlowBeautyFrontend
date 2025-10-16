// salesRoutes.js
import express from "express";
import { getDetailedSalesAnalytics, getSalesData } from "../controllers/salesAnalyticsController.js";


const salesRouter = express.Router();

// Get past 7 days sales data for chart
salesRouter.get("/chart-data", getSalesData);

// Get detailed sales analytics (optional)
salesRouter.get("/analytics", getDetailedSalesAnalytics);



export default salesRouter;