const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Configure email transporter (replace with your own email service)
const emailTransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.mailer_email,
    pass: process.env.mailer_pass,
  },
});

// Function to send email notification
function sendEmail(to, message) {
  const mailOptions = {
    from: process.env.mailer_email,
    to,
    subject: "Medicine Reminder",
    text: message,
  };

  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = sendEmail;