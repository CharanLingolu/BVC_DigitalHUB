import nodemailer from "nodemailer";

// 1. Validation: Ensure credentials exist before starting
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  console.error("❌ Fatal Error: MAIL_USER or MAIL_PASS is not defined.");
  process.exit(1); // Stop the app if critical config is missing
}

// 2. Transporter: Enable 'pool' to keep connections open for faster sending
const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true, // Use pooled connections
  maxConnections: 5, // Max simultaneous connections to the server
  maxMessages: 100, // Max messages per connection before reloading
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 3. Verification: Check connection success on server startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Service Error:", error);
  } else {
    console.log("✅ Email Service is ready to send messages");
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  // Guard clause for empty recipients
  if (!to || (Array.isArray(to) && to.length === 0)) {
    console.warn("⚠️ Email skipped: No recipients defined.");
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: `"BVC DigitalHub" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to} | ID: ${info.messageId}`);
    return info;
  } catch (error) {
    // 4. Error Handling: Log the error but don't crash the app
    console.error("❌ Failed to send email:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};
