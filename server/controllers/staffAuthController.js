import Staff from "../models/Staff.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Convert email to lowercase to match the DB
    const staff = await Staff.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!staff) {
      return res.status(401).json({ message: "Staff member not found" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...staffData } = staff._doc;
    res.json({ token, staff: staffData });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
