import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import session from "express-session";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import studioRouter from "./routes/studio.routes.js";
import bookingRouter from "./routes/booking.routes.js";

import { google } from "googleapis";
import User from "./models/user.model.js";

dotenv.config();

mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log("MongoDB is connected");
	})
	.catch((err) => {
		console.log(err);
	});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Check if the user already exists in the database
				let user = await User.findOne({ googleId: profile.id });

				if (!user) {
					// If user doesn't exist, create a new user and save both tokens
					user = new User({
						googleId: profile.id,
						name: profile.displayName,
						email: profile.emails[0].value,
						profilePicture: profile.photos[0].value,
						accessToken: accessToken, // Store access token
						refreshToken: refreshToken, // Store refresh token
					});
					await user.save();
				} else {
					// If user exists, update the access token
					user.accessToken = accessToken;
					user.refreshToken = refreshToken; // Ensure the refresh token is saved
					await user.save();
				}

				return done(null, user);
			} catch (error) {
				console.error("Error saving user in database:", error);
				return done(error, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/studio", studioRouter);
app.use("/api/booking", bookingRouter);

app.get("/api/calendar/freebusy", async (req, res) => {
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
  timeMaxDate.setUTCHours(23, 59, 59, 999); // Set timeMax to 23:59:59.999 of the 14th day
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
});

app.post("/api/calendar/create-event", async (req, res) => {
	try {
		const user = await User.findOne({ googleId: "106153794536198300860" });

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
		const { summary, description, startDateTime, endDateTime } = req.body;

		if (!summary || !startDateTime || !endDateTime) {
			return res.status(400).send("Missing required event details");
		}

		// Create the event
		const event = {
			summary: summary,
			description: description || "No description provided", // Optional description
			start: {
				dateTime: new Date(startDateTime).toISOString(),
				timeZone: "UTC",
			},
			end: {
				dateTime: new Date(endDateTime).toISOString(),
				timeZone: "UTC",
			},
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
			}
		);
	} catch (error) {
		console.error("Error creating event:", error);
		res.status(500).send("Internal server error");
	}
});

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});

app.listen(3000, () => {
	console.log("Server is running on port 3000!");
});
