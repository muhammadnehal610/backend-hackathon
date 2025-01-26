import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set up the Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use a different email service provider if needed
  auth: {
    user: process.env.EMAIL_USER,  // Your email address (e.g., example@gmail.com)
    pass: process.env.EMAIL_PASS,  // Your email password or an app-specific password
  },
});

// Function to send Email
export const sendEmail = (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Your email address
    to: to,  // recipient's email address
    subject: subject,  // Email subject
    text: message,  // Email body in plain text (you can also use HTML if desired)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(`Email sent to ${to}: ${info.response}`);
    }
  });
};
