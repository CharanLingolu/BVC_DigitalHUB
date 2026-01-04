import express from "express";
import { staffLogin } from "../controllers/staffAuthController.js";
import { updateStaffProfile } from "../controllers/staffController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

// ✅ THIS LINE WAS MISSING
const router = express.Router();

// Route: POST /api/staff/auth/login
router.post("/login", staffLogin);

// Route: PUT /api/staff/auth/profile
// Uses: Auth (protect), File Upload (upload), and Controller (updateStaffProfile)
router.put("/profile", protect, upload.single("photo"), updateStaffProfile);

export default router;
