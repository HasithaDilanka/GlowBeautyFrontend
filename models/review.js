import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  product: String,
  title: String,
  review: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: String, default: new Date().toISOString().split("T")[0] }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
