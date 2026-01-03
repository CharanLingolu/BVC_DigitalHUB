export const sendEmail = async ({ to, subject, html }) => {
  if (process.env.NODE_ENV === "production") {
    console.log("📧 Email skipped in production for:", to);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"BVC DigitalHub" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("❌ Mail transporter error:", error.message);
  }
};
