import Staff from "../models/Staff.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

/* ➕ ADD STAFF */
export const addStaff = async (req, res) => {
  try {
    const { password, ...otherDetails } = req.body;

    // 1. Hash password for database storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Save to Database
    const staff = await Staff.create({
      ...otherDetails,
      password: hashedPassword,
      photo: req.file?.path || "",
    });

    // 3. Send Email with plain-text credentials
    // We send this after creation to ensure the user exists first
    const emailData = {
      to: staff.email,
      subject: "Welcome to BVC DigitalHub - Your Faculty Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
          <h2 style="color: #4f46e5; text-align: center;">Welcome to the Faculty Hub</h2>
          <p>Hello <strong>${staff.name}</strong>,</p>
          <p>Your official faculty account has been created. You can now log in using the following credentials:</p>
          
          <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email:</strong> ${staff.email}</p>
            <p style="margin: 5px 0 0 0;"><strong>Password:</strong> ${password}</p>
          </div>
          
          <p style="font-size: 0.9em; color: #666;">
            <em>Note: For security reasons, please change your password immediately after your first login.</em>
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; font-size: 0.8em; color: #999;">
            This is an automated message from BVC DigitalHub. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    // Fire and forget (or await if you want to ensure email success before responding)
    await sendEmail(emailData);

    res.status(201).json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add staff" });
  }
};

/* 📄 GET ALL STAFF */
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};

/* ✏️ UPDATE STAFF */
export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const { password, ...otherDetails } = req.body;

    // Update normal fields
    Object.assign(staff, otherDetails);

    // Update password only if a new one is provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(password, salt);
    }

    // Update photo if uploaded
    if (req.file) {
      staff.photo = req.file.path;
    }

    await staff.save();

    res.json({ message: "Staff updated successfully", staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update staff" });
  }
};

/* 🗑️ DELETE STAFF */
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete staff" });
  }
};
