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
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1, h2 {
            color: #2c3e50;
          }
          p {
            line-height: 1.6;
          }
          .studio-image {
            width: 100%;
            max-height: 250px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .btn {
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
          }
          .btn:hover {
            background-color: #2980b9;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Booking Confirmation</h1>
          <p>Dear ${options.userName},</p>
          <p>Thank you for booking with us! Your booking has been successfully confirmed. Below are the details of your booking:</p>
          
          <h2>Booking Details:</h2>
          <p><strong>Studio Title:</strong> ${options.studioTitle}</p>
          <p><strong>Studio Address:</strong> ${options.studioAddress}</p>
          <p><strong>Description:</strong> ${options.studioDescription}</p>
          <img class="studio-image" src="${
            options.studioImage
          }" alt="Studio Image" />

                    <h2>Booking Time:</h2>
          <p><strong>Date:</strong> ${options.bookingDate}</p>
          <p><strong>Start Time:</strong> ${options.startTime}</p>
          <p><strong>End Time:</strong> ${options.endTime}</p>
          
          <h2>User Details:</h2>
          <p><strong>Name:</strong> ${options.userName}</p>
          <p><strong>Email:</strong> ${options.userEmail}</p>
          ${
            options.userNote
              ? `<p><strong>Note:</strong> ${options.userNote}</p>`
              : ""
          }
          

          <h2>Studio Manager Details:</h2>
          <p><strong>Manager's Name:</strong> ${options.managerName}</p>
          <p><strong>Manager's Email:</strong> ${options.managerEmail}</p>
          <img src="${
            options.managerPicture
          }" alt="Manager Picture" style="max-width: 100px; border-radius: 50%;" />
          
          <p>If you have any questions, feel free to contact the studio manager directly.</p>
          <p>We look forward to seeing you soon!</p>

          <div class="footer">
            <p>&copy; 2024 Studios. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
