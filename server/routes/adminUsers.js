import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserDetailsAdmin,
  deleteUserAdmin,
} from "../controllers/adminUserController.js";
import authAdmin from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/users", authAdmin, getAllUsers);
router.get("/users/:id", authAdmin, getUserById);

router.put(
  "/users/:id",
  authAdmin,
  upload.single("profilePic"),
  updateUserDetailsAdmin
);

router.delete("/users/:id", authAdmin, deleteUserAdmin);

export default router;
