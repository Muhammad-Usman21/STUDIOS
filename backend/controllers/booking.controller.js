import { google } from "googleapis";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/mail.js";

dotenv.config();

export const getFreeBusy = async (req, res) => {
  const user = await User.findOne({ googleId: "106153794536198300860" });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  const accessToken = credentials.access_token;

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const now = new Date(req.query.date);
  const timeMin = now.toISOString();

  const timeMaxDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days ahead
  timeMaxDate.setUTCHours(23, 59, 59, 999);
  const timeMax = timeMaxDate.toISOString();

  calendar.freebusy.query(
    {
      resource: {
        timeMin,
        timeMax,
        items: [{ id: "primary" }],
      },
    },
    (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(response.data);
    }
  );
};

export const createBooking = async (req, res) => {
  const { userId, title,address, city, image, description, name, email, note, startDateTime, endDateTime, } =
    req.body;

    console.log(req.body);
  try {
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    // Refresh access token if necessary
    const { credentials } = await oauth2Client.refreshAccessToken();
    const accessToken = credentials.access_token;

    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    // Google Calendar API instance
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Extract event details from the request body

    if (!startDateTime || !endDateTime || !name || !email) {
      return res.status(400).send("Missing required event details");
    }

    // Create the event
    const event = {
      summary: `Reservation: ${title} by ${name}`,
      description: "Name: " + name + "\nEmail: " + email + "\nNote: " + note,
      start: {
        dateTime: new Date(startDateTime).toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(endDateTime).toISOString(),
        timeZone: "UTC",
      },
      attendees: [{ email: email }],
    };

    // Insert event into Google Calendar
    calendar.events.insert(
      {
        calendarId: "primary",
        resource: event,
      },
      (err, response) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send(response.data); // Send the created event data as the response
        sendEmail({
          to: email,
          subject: "Booking Confirmation - Studio",
          userName: name,
          userEmail: email,
          userNote: note,
          studioTitle: title,
          studioAddress: address,
          studioDescription: description,
          studioImage: image,
          managerName: user.name,
          managerEmail: user.email,
          managerPicture: user.profilePicture,
          bookingDate: new Date(startDateTime).toDateString(),
          startTime: new Date(startDateTime).toLocaleTimeString(),
          endTime: new Date(endDateTime).toLocaleTimeString(),
        });
      }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Internal server error");
  }
};