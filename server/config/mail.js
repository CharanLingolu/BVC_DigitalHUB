import nodemailer from "nodemailer";

console.log("📧 MAIL_USER:", process.env.MAIL_USER);
console.log("🔐 MAIL_PASS loaded:", !!process.env.MAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Mail transporter error:", error.message);
  } else {
    console.log("✅ Mail server ready");
  }
});

export default transporter;
