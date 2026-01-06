import Event from "../models/Event.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= GET ALL EVENTS ================= */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE EVENT + EMAIL ================= */
export const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, category } = req.body;

    let banner = "";
    if (req.file) {
      banner = req.file.path;
    }

    const newEvent = new Event({
      title,
      date,
      time,
      location,
      description,
      category,
      banner,
    });

    const savedEvent = await newEvent.save();

    /* ========== EMAIL NOTIFICATION LOGIC ========== */
    const users = await User.find({ email: { $exists: true } }).select("email");
    const staff = await Staff.find({ email: { $exists: true } }).select(
      "email"
    );

    const uniqueEmails = [
      ...new Set([...users.map((u) => u.email), ...staff.map((s) => s.email)]),
    ];

    if (uniqueEmails.length > 0) {
      const emailHtml = `
        <div style="background-color: #f8fafc; padding: 40px 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 40px; text-align: center; color: white;">
              <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px;">New Announcement</div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${title}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">${
                category || "General Event"
              }</p>
            </div>

            <div style="padding: 40px; color: #1e293b;">
              <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 25px;">
                Hello Team, <br/> We are excited to announce a new event on the <b>BVC Digital Hub</b>. Mark your calendars!
              </p>

              <div style="background: #f1f5f9; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="font-size: 20px; margin-right: 12px;">📅</span>
                  <span style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; width: 80px;">Date:</span>
                  <span style="color: #1e293b; font-weight: bold;">${new Date(
                    date
                  ).toDateString()}</span>
                </div>
                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="font-size: 20px; margin-right: 12px;">⏰</span>
                  <span style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; width: 80px;">Time:</span>
                  <span style="color: #1e293b; font-weight: bold;">${time}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 20px; margin-right: 12px;">📍</span>
                  <span style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; width: 80px;">Venue:</span>
                  <span style="color: #1e293b; font-weight: bold;">${location}</span>
                </div>
              </div>

              <div style="border-left: 4px solid #6366f1; padding-left: 20px; margin-bottom: 35px;">
                <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0;">${description}</p>
              </div>

              <div style="text-align: center;">
                <a href="https://bvc-digital-hub.vercel.app/" style="display: inline-block; background: #6366f1; color: #ffffff; padding: 16px 40px; border-radius: 14px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);">View Event Details</a>
              </div>
            </div>

            <div style="padding: 30px; background: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; font-size: 13px; color: #94a3b8; font-weight: 600;">BVC Digital Hub Admin Panel</p>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px;">This is an automated campus notification</p>
            </div>
          </div>
        </div>
      `;

      await sendEmail({
        to: uniqueEmails,
        subject: `📢 New Event: ${title}`,
        html: emailHtml,
      });
    }

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= UPDATE EVENT + EMAIL ================= */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      updates.banner = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    /* ========== EMAIL NOTIFICATION FOR UPDATE ========== */
    const users = await User.find({ email: { $exists: true } }).select("email");
    const staff = await Staff.find({ email: { $exists: true } }).select(
      "email"
    );

    const uniqueEmails = [
      ...new Set([...users.map((u) => u.email), ...staff.map((s) => s.email)]),
    ];

    if (uniqueEmails.length > 0) {
      const emailHtml = `
        <div style="background-color: #f1f5f9; padding: 40px 10px; font-family: 'Segoe UI', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0d9488 100%); padding: 40px; text-align: center; color: white;">
              <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px;">Schedule Updated</div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 800;">${
                updatedEvent.title
              }</h1>
            </div>

            <div style="padding: 40px; color: #1e293b;">
              <p style="font-size: 16px; color: #64748b; margin-bottom: 25px; text-align: center;">The details for this event have been modified. Please review the updated schedule below.</p>

              <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                <p style="margin: 8px 0;">📅 <b>New Date:</b> ${new Date(
                  updatedEvent.date
                ).toDateString()}</p>
                <p style="margin: 8px 0;">⏰ <b>New Time:</b> ${
                  updatedEvent.time
                }</p>
                <p style="margin: 8px 0;">📍 <b>Venue:</b> ${
                  updatedEvent.location
                }</p>
              </div>

              <div style="text-align: center; margin-top: 35px;">
                <a href="https://bvc-digital-hub.vercel.app/" style="display: inline-block; background: #0d9488; color: #ffffff; padding: 14px 35px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px;">View Full Changes</a>
              </div>
            </div>

            <div style="padding: 25px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
              Campus Portal | Automated Event Synchronization
            </div>
          </div>
        </div>
      `;

      await sendEmail({
        to: uniqueEmails,
        subject: `🔄 Updated Event: ${updatedEvent.title}`,
        html: emailHtml,
      });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE EVENT ================= */
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
