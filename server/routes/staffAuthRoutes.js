import express from "express";
import { staffLogin } from "../controllers/staffAuthController.js";

const router = express.Router();

// This handles: POST /api/staff/auth/login
router.post("/login", staffLogin);

export default router;
