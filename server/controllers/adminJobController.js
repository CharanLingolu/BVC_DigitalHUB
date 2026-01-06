import Job from "../models/Job.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import { sendEmail } from "../utils/sendEmail.js";

// ================= GET ALL JOBS =================
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CREATE JOB (WITH EMAIL) =================
export const createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();

    const students = await User.find({ email: { $exists: true } }).select(
      "email"
    );
    const staff = await Staff.find({ email: { $exists: true } }).select(
      "email"
    );

    const uniqueEmails = [
      ...new Set([
        ...students.map((s) => s.email),
        ...staff.map((f) => f.email),
      ]),
    ];

    if (uniqueEmails.length > 0) {
      await sendEmail({
        to: uniqueEmails,
        subject: `📢 New Opportunity: ${savedJob.title} at ${savedJob.company}`,
        html: `
          <div style="background-color: #f8fafc; padding: 40px 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
              
              <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 40px; text-align: center; color: white;">
                <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px;">New Posting</div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${
                  savedJob.title
                }</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">${
                  savedJob.company
                }</p>
              </div>

              <div style="padding: 40px; color: #1e293b;">
                <div style="margin-bottom: 25px;">
                   <p style="font-size: 16px; line-height: 1.6; color: #475569;">A new career opportunity has just been posted on the BVC DigitalHub portal that matches your profile.</p>
                </div>

                <div style="background: #f1f5f9; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                   <div style="margin-bottom: 15px; display: flex;">
                     <span style="color: #64748b; width: 100px; font-size: 13px; font-weight: 600; text-transform: uppercase;">Location:</span>
                     <span style="color: #1e293b; font-weight: bold;">📍 ${
                       savedJob.location
                     }</span>
                   </div>
                   <div style="margin-bottom: 15px; display: flex;">
                     <span style="color: #64748b; width: 100px; font-size: 13px; font-weight: 600; text-transform: uppercase;">Type:</span>
                     <span style="color: #1e293b; font-weight: bold;">💼 ${
                       savedJob.type
                     }</span>
                   </div>
                   ${
                     savedJob.salary
                       ? `
                   <div style="margin-bottom: 15px; display: flex;">
                     <span style="color: #64748b; width: 100px; font-size: 13px; font-weight: 600; text-transform: uppercase;">Package:</span>
                     <span style="color: #059669; font-weight: bold;">💰 ${savedJob.salary}</span>
                   </div>`
                       : ""
                   }
                   <div style="display: flex;">
                     <span style="color: #64748b; width: 100px; font-size: 13px; font-weight: 600; text-transform: uppercase;">Deadline:</span>
                     <span style="color: #e11d48; font-weight: bold;">⏳ ${
                       savedJob.deadline
                         ? new Date(savedJob.deadline).toDateString()
                         : "Open"
                     }</span>
                   </div>
                </div>

                <div style="border-left: 4px solid #6366f1; padding-left: 20px; margin-bottom: 35px;">
                   <p style="font-size: 14px; font-style: italic; color: #64748b; margin: 0;">"${savedJob.description.substring(
                     0,
                     150
                   )}..."</p>
                </div>

                <div style="text-align: center;">
                  <a href="${
                    savedJob.link || "#"
                  }" style="display: inline-block; background: #6366f1; color: #ffffff; padding: 16px 40px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);">Apply Now</a>
                </div>
              </div>

              <div style="padding: 30px; background: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 13px; color: #94a3b8; font-weight: 600;">BVC DigitalHub Placement Cell</p>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px;">Official Notification System</p>
              </div>
            </div>
          </div>
        `,
      });
    }

    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Job creation failed:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================= UPDATE JOB (WITH EMAIL) =================
export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const students = await User.find({ email: { $exists: true } }).select(
      "email"
    );
    const staff = await Staff.find({ email: { $exists: true } }).select(
      "email"
    );

    const uniqueEmails = [
      ...new Set([
        ...students.map((s) => s.email),
        ...staff.map((f) => f.email),
      ]),
    ];

    if (uniqueEmails.length > 0) {
      await sendEmail({
        to: uniqueEmails,
        subject: `🔄 Updated: ${updatedJob.title} at ${updatedJob.company}`,
        html: `
          <div style="background-color: #f1f5f9; padding: 40px 10px; font-family: 'Segoe UI', sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
              
              <div style="background: #1e293b; padding: 40px; text-align: center; color: white;">
                <div style="background: #334155; display: inline-block; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: bold; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px;">Listing Updated</div>
                <h1 style="margin: 0; font-size: 26px; font-weight: 800;">${
                  updatedJob.title
                }</h1>
              </div>

              <div style="padding: 40px; color: #334155;">
                <p style="font-size: 16px; margin-bottom: 25px; text-align: center; color: #64748b;">Important changes have been made to this job posting. Please review the updated details below.</p>

                <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                  <h3 style="margin-top: 0; font-size: 14px; color: #2563eb; text-transform: uppercase;">Updated Requirements:</h3>
                  <p style="margin: 5px 0;">🏢 <strong>Company:</strong> ${
                    updatedJob.company
                  }</p>
                  <p style="margin: 5px 0;">📍 <strong>Location:</strong> ${
                    updatedJob.location
                  }</p>
                  <p style="margin: 5px 0;">⏳ <strong>Deadline:</strong> ${
                    updatedJob.deadline
                      ? new Date(updatedJob.deadline).toDateString()
                      : "N/A"
                  }</p>
                </div>

                <p style="font-size: 14px; line-height: 1.8; color: #475569;">${
                  updatedJob.description
                }</p>

                <div style="text-align: center; margin-top: 35px;">
                  <a href="${
                    updatedJob.link || "#"
                  }" style="display: inline-block; background: #1e293b; color: #ffffff; padding: 14px 35px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">View Updated Details</a>
                </div>
              </div>

              <div style="padding: 25px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                Career Portal | Auto-notification for Job Update
              </div>
            </div>
          </div>
        `,
      });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Job update failed:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================= DELETE JOB =================
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
