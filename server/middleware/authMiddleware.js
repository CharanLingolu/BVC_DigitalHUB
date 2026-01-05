import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Staff from "../models/Staff.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ 1. Check User (Student)
      let account = await User.findById(decoded.id).select("-password");

      // ✅ 2. Check Staff (THIS FIXES YOUR ISSUE)
      if (!account) {
        account = await Staff.findById(decoded.id).select("-password");
      }

      // ✅ 3. Check Admin
      if (!account) {
        account = await Admin.findById(decoded.id).select("-password");
      }

      if (!account) {
        return res
          .status(401)
          .json({ message: "Not authorized, account not found" });
      }

      // Attach found account (Student OR Staff OR Admin) to req.user
      req.user = account;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
