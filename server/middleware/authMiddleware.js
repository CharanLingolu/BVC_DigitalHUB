import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Staff from "../models/Staff.js";

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 2️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3️⃣ Get account (exclude password)
      // Check User Collection
      let account = await User.findById(decoded.id).select("-password");

      // ✅ FIX: If not User, check Admin
      if (!account) {
        account = await Admin.findById(decoded.id).select("-password");
      }

      // ✅ FIX: If not Admin, check Staff
      if (!account) {
        account = await Staff.findById(decoded.id).select("-password");
      }

      // 4️⃣ Final Check
      if (!account) {
        return res.status(401).json({ message: "Account not found" });
      }

      // Attach the found account to req.user so controllers can access it
      req.user = account;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

export default protect;
