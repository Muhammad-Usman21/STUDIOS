import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res, next) => {
	const { name, email, firebaseId } = req.body;
	console.log(req.body);

	const checkEmail = await User.findOne({ email });
	if (checkEmail) {
		return next(errorHandler(400, "Email already exists. Try another one!"));
	}

	const newUser = new User({
		name,
		email,
		firebaseId
	});

	try {
		await newUser.save();
		res.status(201).json("User created successfully");
	} catch (error) {
		next(error);
	}
};

export const signin = async (req, res, next) => {
	const { email, firebaseId } = req.body;

	if (!email || !firebaseId || email === "" || firebaseId === "") {
		return next(errorHandler(400, "All fields are required!"));
	}

	try {
		const validUser = await User.findOne({
			email: email,
		});

		if (!validUser || firebaseId !== validUser.firebaseId) {
			return next(errorHandler(404, "Oops! User not found."));
		}

		const token = jwt.sign(
			{
				id: validUser._id,
				firebaseId: validUser.firebaseId,
				isAdmin: validUser.isAdmin,
			},
			process.env.JWT_SECRET
		);

		res
			.status(200)
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.json(validUser._doc);
	} catch (error) {
		next(error);
	}
};

export const signout = (req, res, next) => {
	try {
		res
			.clearCookie("access_token")
			.status(200)
			.json("User has been signed out");
	} catch (error) {
		next(error);
	}
};


export const google = async (req, res, next) => {
	const { email, name, googlePhotoUrl, firebaseId } = req.body;
	try {
		const user = await User.findOne({ email });
		if (user) {
			const token = jwt.sign(
				{
					id: user._id,
					firebaseId: user.firebaseId,
					isAdmin: user.isAdmin,
				},
				process.env.JWT_SECRET
			);
			res
				.status(200)
				.cookie("access_token", token, { httpOnly: true })
				.json(user._doc);
		} else {
			const newUser = new User({
				name,
				email,
				profilePicture: googlePhotoUrl,
				googleAuth: true,
				firebaseId,
			});
			await newUser.save();
			const token = jwt.sign(
				{
					id: newUser._id,
					firebaseId: newUser.firebaseId,
					isAdmin: newUser.isAdmin,
				},
				process.env.JWT_SECRET
			);

			res
				.status(200)
				.cookie("access_token", token, {
					httpOnly: true,
				})
				.json(newUser._doc);
		}
	} catch (error) {
		next(error);
	}
};
