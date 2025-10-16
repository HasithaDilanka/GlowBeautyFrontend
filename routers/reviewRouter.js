import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();   // ✅ correct variable name

// POST -> save review
reviewRouter.post("/", addReview);

// GET -> fetch all reviews
reviewRouter.get("/", getReviews);

export default reviewRouter; 
