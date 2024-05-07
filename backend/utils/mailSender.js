const nodemailer = require("nodemailer");

const mailSender = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("MAIL SENDING ERROR ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
