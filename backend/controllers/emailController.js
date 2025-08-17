import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  try {
    const { summary, emails } = req.body;
    if (!summary || !emails) {
      return res.status(400).json({ success:false , error: "Summary and emails are required" });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emails, 
      subject: "AI Meeting Notes Summary",
      text: summary,
    });

    res.json({success:true , message: "Email sent successfully" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
};
