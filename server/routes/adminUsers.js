import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/adminUserController.js";
import authAdmin from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* EXISTING */
router.get("/users", authAdmin, getAllUsers);

/* ✅ ADD THIS */
router.get("/users/:id", authAdmin, getUserById);

/* (already planned / optional) */
router.put(
  "/users/:id",
  authAdmin,
  upload.single("profilePic"),
  updateUser
);

router.delete("/users/:id", authAdmin, deleteUser);

export default router;
