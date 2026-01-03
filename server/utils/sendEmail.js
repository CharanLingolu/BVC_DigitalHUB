import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!to || to.length === 0) return;

  try {
    await transporter.sendMail({
      from: `"BVC DigitalHub" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Mail transporter error:", error.message);
    // ❗ DO NOT THROW — prevents signup failure
  }
};
