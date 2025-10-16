import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import OTP from "../models/otp.js";
import nodemailer from "nodemailer";

const pw = "peuefmmyevlobfbg";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hasionyxia@gmail.com",
    pass: pw,
  },
});

// ✅ Create user (with role)
export function createUser(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const passwordHash = bcrypt.hashSync(req.body.password, 10);

    let userData = {
      email: req.body.email,
      password: passwordHash,
      role: req.body.role || "user", // <-- add role support
    };

    if (req.body.username) {
      const nameParts = req.body.username.trim().split(" ");
      userData.firstName = nameParts[0];
      userData.lastName =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    } else if (req.body.firstName && req.body.lastName) {
      userData.firstName = req.body.firstName;
      userData.lastName = req.body.lastName;
    } else {
      return res
        .status(400)
        .json({ message: "First name and last name are required" });
    }

    const user = new User(userData);

    user
      .save()
      .then(() => {
        res.status(201).json({
          message: "User created successfully",
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role, // ✅ return role
          },
        });
      })
      .catch((error) => {
        console.error("User creation error:", error);
        if (error.code === 11000) {
          res.status(409).json({ message: "Email already exists" });
        } else {
          res.status(500).json({ message: "Failed to create user" });
        }
      });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Update user (with role)
export async function updateUser(req, res) {
  const userId = req.params.id;
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const updatedData = { firstName, lastName, email, role };
    if (password) {
      updatedData.password = bcrypt.hashSync(password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
}

// ✅ Login user
export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json({ message: "User not found" });

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect)
        return res.status(403).json({ message: "Invalid password" });

      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isBlocked: user.isBlocked,
          isEmailVerified: user.isEmailVerified,
          image: user.image,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ message: "Login successful", token, role: user.role });
    })
    .catch((error) =>
      res.status(500).json({ message: "Error logging in", error })
    );
}

// Get user
export function getUser(req, res) {
  if (!req.user) return res.status(400).json({ message: "User not found" });
  res.json(req.user);
}

// Check admin
export function isAdmin(req) {
  return req.user?.role === "admin";
}

// ✅ Google login
export async function googleLogin(req, res) {
  const googleToken = req.body.token;

  try {
    if (!googleToken)
      return res.status(400).json({ message: "Google token missing" });

    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${googleToken}` } }
    );

    const { email, given_name, family_name, picture } = response.data;

    if (!email)
      return res.status(400).json({ message: "Google did not return an email" });

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        firstName: given_name || "Google",
        lastName: family_name || "User",
        image: picture,
        role: "user", // default role
        isBlocked: false,
        isEmailVerified: true,
        password: "123",
      });
      await user.save();
    }

    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: "JWT_SECRET missing" });

    const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isBlocked: user.isBlocked,
        isEmailVerified: user.isEmailVerified,
        image: user.image,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, message: "Login successful", role: user.role });
  } catch (error) {
    console.error(
      "Google login error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Failed to authenticate with Google",
      error: error.response?.data || error.message,
    });
  }
}

// ✅ Send OTP
export async function sendOTP(req, res) {
  const email = req.body.email;
  const otpCode = Math.floor(100000 + Math.random() * 900000);

  try {
    await OTP.deleteMany({ email: email });
    const newOTP = new OTP({ email: email, otp: otpCode });
    await newOTP.save();

    const message = {
      from: "hasionyxia@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}`,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send OTP" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "OTP sent successfully" });
      }
    });
  } catch {
    res.status(500).json({ message: "Failed to delete previous OTPs" });
  }
}

// ✅ Reset password
export async function resetPassword(req, res) {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const otp = req.body.otp;

  try {
    const otpRecord = await OTP.findOne({ email: email, otp: otp });
    if (!otpRecord) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await User.updateOne({ email: email }, { password: hashedPassword });
    await OTP.deleteMany({ email: email });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
}

// ✅ Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

// ✅ Delete user
export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
}

// ✅ Block / Unblock user
export async function toggleBlockUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${
        user.isBlocked ? "blocked" : "unblocked"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status" });
  }
}
