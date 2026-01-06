import express from "express";
import {
  signup,
  login,
  sendSignupOtp,
  verifyOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendSignupOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post("/login", login);

export default router;
