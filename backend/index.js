import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import studioRouter from "./routes/studio.routes.js";
import commentRouter from "./routes/comment.routes.js";
import storageRouter from "./routes/storage.routes.js";
import cookieParser from "cookie-parser";

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
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/studio", studioRouter);
app.use("/api/comment", commentRouter);
app.use("/api/storage", storageRouter);

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
