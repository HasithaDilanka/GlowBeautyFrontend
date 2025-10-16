// File: routes/dashboardRoute.js  
// CREATE THIS FILE - Copy this entire code

import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", getDashboardStats);

export default dashboardRouter;