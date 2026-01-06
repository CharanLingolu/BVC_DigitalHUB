import express from "express";
import { staffLogin } from "../controllers/staffAuthController.js";
import { updateStaffProfile } from "../controllers/staffController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/login", staffLogin);

router.put("/profile", protect, upload.single("photo"), updateStaffProfile);

export default router;
