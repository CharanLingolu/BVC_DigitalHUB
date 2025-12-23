import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* =========================
   🔹 GET ALL USERS
========================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* =========================
   🔹 GET USER BY ID
========================= */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* =========================
   🔹 UPDATE USER (ADMIN)
   - Supports profile edit
   - Supports profile pic
   - Supports password reset
========================= */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* -------- SAFE FIELD UPDATES -------- */
    const allowedFields = [
      "name",
      "email",
      "department",
      "year",
      "rollNumber",
      "bio",
      "skills",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    /* -------- PROFILE PIC (Cloudinary) -------- */
    if (req.file) {
      user.profilePic = req.file.path; // Cloudinary URL
    }

    /* -------- PASSWORD RESET -------- */
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

/* =========================
   🔹 DELETE USER
========================= */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
