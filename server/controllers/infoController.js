import Staff from "../models/Staff.js";
import Event from "../models/Event.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

// 📊 Get dashboard stats (Public)
export const getStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments();
    const staffCount = await Staff.countDocuments();

    res.status(200).json({
      students: studentCount,
      staff: staffCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// 👨‍🏫 Get all staff
export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ department: 1 });
    res.status(200).json(staff);
  } catch {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
};

// 🎉 Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// 💼 Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format to prevent casting crashes
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Job ID format" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🎉 Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch {
    res.status(500).json({ message: "Failed to load event" });
  }
};

export const applyForJob = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"BVC Digital Hub" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Job Application Submitted Successfully",
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        /* Fallback for clients that support internal styles */
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden;">
        
        <div style="background-color: #0056b3; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">BVC Digital Hub</h1>
        </div>

        <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
          <h2 style="color: #0056b3; font-size: 22px; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Application Received</h2>
          
          <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>

          <p style="color: #555555;">Thank you for applying through <b>BVC Digital Hub</b>. We are pleased to confirm that your application has been submitted successfully.</p>

          <div style="background-color: #f9fbfd; border-left: 4px solid #0056b3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #777;"><strong>Applicant Name:</strong> <span style="color: #333;">${name}</span></p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #777;"><strong>Contact Number:</strong> <span style="color: #333;">${phone}</span></p>
          </div>

          <p style="color: #555555;">Our team will review your profile carefully. If your qualifications match our requirements, we will contact you regarding the next steps.</p>

          <br />
          <p style="margin-bottom: 5px;">Best Regards,</p>
          <p style="margin-top: 0; font-weight: bold; color: #0056b3;">BVC Digital Hub Placement Team</p>
        </div>

        <div style="background-color: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} BVC Digital Hub. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
        </div>

      </div>
    </body>
    </html>
  `,
    });

    res.json({ message: "Mail sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email" });
  }
};
