import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// OTP email orqali yuborish
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Sizning OTP kodingiz",
    text: `Sizning OTP kodingiz: ${otp}. Bu kod 10 daqiqa amal qiladi.`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTP;
