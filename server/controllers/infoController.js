import Staff from "../models/Staff.js";
import Event from "../models/Event.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

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

// 🔍 Get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

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

// 🚀 Apply for Job (Updated to use Brevo & Modern UI)
export const applyForJob = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    // Fetch job details for the email
    const job = await Job.findById(id);
    const jobTitle = job ? job.title : "the selected position";
    const companyName = job ? job.company : "BVC Partner";

    // ✅ SEND EMAIL VIA BREVO
    await sendEmail({
      to: email,
      subject: `🚀 Application Received: ${jobTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Inter', sans-serif;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            
            <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 60px 20px; text-align: center; color: white;">
              <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px;">
                BVC DigitalHub Careers
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.05em;">Application Successful!</h1>
            </div>

            <div style="padding: 40px 30px; background-color: #ffffff;">
              <p style="font-size: 18px; color: #1e293b; margin-bottom: 24px;">Hi <strong>${name}</strong>,</p>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.7; margin-bottom: 30px;">
                You've taken the next step in your career. Your application for <span style="color: #6366f1; font-weight: 700;">${jobTitle}</span> at <strong>${companyName}</strong> has been received and is ready for review.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Submission Details</h3>
                <div style="margin-bottom: 8px; color: #1e293b; font-size: 15px;"><strong>ID:</strong> ${id}</div>
                <div style="margin-bottom: 8px; color: #1e293b; font-size: 15px;"><strong>Phone:</strong> ${phone}</div>
                <div style="color: #1e293b; font-size: 15px;"><strong>Status:</strong> <span style="color: #10b981; font-weight: 700;">Pending Review</span></div>
              </div>

              <div style="text-align: center; margin-top: 40px;">
                <a href="${
                  process.env.CLIENT_URL || "#"
                }/jobs" style="background: #6366f1; color: #ffffff; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-weight: 900; font-size: 14px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);">
                  View More Opportunities
                </a>
              </div>
            </div>

            <div style="background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 700;">BVC DigitalHub • Official Careers Portal</p>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 11px;">
                © ${new Date().getFullYear()} All Rights Reserved. This is an automated notification.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    res.json({
      success: true,
      message: "Application sent successfully via Brevo",
    });
  } catch (error) {
    console.error("❌ Application Controller Error:", error);
    res.status(500).json({ message: "Failed to send application email" });
  }
};
