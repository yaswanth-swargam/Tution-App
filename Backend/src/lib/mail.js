import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendNotificationEmail = async ({
  to,
  title,
  message,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: title,
    text: message,
  });
};

export default transporter;