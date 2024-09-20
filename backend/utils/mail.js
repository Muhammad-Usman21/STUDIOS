import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_MAIL_EMAIL,
      pass: process.env.APP_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"STUDIOS" <${process.env.APP_MAIL_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};