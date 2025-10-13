import express from 'express';
import { createUser, deleteUser, getAllUsers, getUser, googleLogin, loginUser, resetPassword, sendOTP, toggleBlockUser, updateUser, } from '../controllers/userController.js';

const userRouter = express.Router();

// Public routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLogin);
userRouter.post("/send-otp", sendOTP);
userRouter.post("/reset-password", resetPassword);

// User routes (may need auth middleware)
userRouter.get("/", getUser);
userRouter.put("/:id", updateUser);

// Admin routes - Fixed to match frontend calls
userRouter.get("/all", getAllUsers);  // Changed from "/admin/users" to "/all"
userRouter.delete("/:id", deleteUser);  // Changed from "/admin/users/:id" to "/:id"
userRouter.patch("/:id/block", toggleBlockUser);  // Changed from PUT to PATCH and fixed path

export default userRouter;