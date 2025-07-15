import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { myError } from "../utils/error.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "openpin_secret_locopolopololoco";
const COOKIE_NAME = "token";

// 🔐 1. Generate Token + Set Cookie + Return Token
export const generateToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// ✅ 2. Verify User from Cookie & Attach to req.user
export const protect = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // remove password

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user; // attach to request
    next();
  } catch (err) {
    myError(err, "auth protect middleware");
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
