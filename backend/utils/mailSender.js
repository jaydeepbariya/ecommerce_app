const nodemailer = require("nodemailer");

const mailSender = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      port: 465,
      secure: true,
      secureConnection: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html: text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("MAIL SENDING ERROR ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = mailSender;
