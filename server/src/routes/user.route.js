import express from "express";
import {
  userLogin,
  userLogout,
  userProfile,
  userProfileUpdate,
  userRegister,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/profile", protect, userProfile);
router.patch("/updateProfile", protect, userProfileUpdate);
router.post("/logout", protect, userLogout);

export default router;
