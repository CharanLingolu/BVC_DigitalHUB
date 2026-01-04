import Staff from "../models/Staff.js";
import cloudinary from "../config/cloudinary.js"; // ✅ REQUIRED for image upload

// Get Staff by ID (Public or Admin view)
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Logged-in Staff Profile
export const updateStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id);

    if (staff) {
      // 1. Update Basic Text Fields
      staff.name = req.body.name || staff.name;
      staff.position = req.body.position || staff.position;
      staff.department = req.body.department || staff.department;
      staff.qualification = req.body.qualification || staff.qualification;
      staff.experience = req.body.experience || staff.experience;
      staff.bio = req.body.bio || staff.bio;

      // 2. Handle Subjects (Fix for FormData)
      if (req.body.subjects) {
        try {
          // FormData sends arrays as strings, so we parse it
          staff.subjects = JSON.parse(req.body.subjects);
        } catch (error) {
          // Fallback if it's already a string or simple array
          staff.subjects = req.body.subjects;
        }
      }

      // 3. Handle Photo Upload (Fix for FormData)
      if (req.file) {
        // Upload new photo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        staff.photo = result.secure_url;
      }

      // 4. Update Email (Optional check)
      if (req.body.email) staff.email = req.body.email;

      // 5. Save
      const updatedStaff = await staff.save();

      // Return Data (exclude password)
      const { password, ...staffData } = updatedStaff._doc;

      res.json({
        success: true,
        staff: staffData,
      });
    } else {
      res.status(404).json({ message: "Staff member not found" });
    }
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server Error updating profile" });
  }
};
