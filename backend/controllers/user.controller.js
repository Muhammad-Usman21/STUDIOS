import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";

dotenv.config();

export const updateUser = async (req, res, next) => {
	// console.log(req.user);
	if (req.user.id !== req.params.userId) {
		return next(errorHandler(403, "You are not allowed to update this user"));
	}

	// let hashedPassword;
	const { name, profilePicture } = req.body;

	const validUser = await User.findById(req.params.userId);
	if (!validUser) {
		return next(errorHandler(404, "Oops! User not found."));
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.userId,
			{
				$set: {
					name,
					profilePicture,
				},
			},
			{ new: true }
		);

		res.status(200).json(updatedUser._doc);
	} catch (error) {
		next(error);
	}
};

export const getUsers = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 10;
		const sortDirection = req.query.sort === "asc" ? 1 : -1;

		const users = await User.find()
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		res.status(200).json({
			users,
		});
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) {
			return next(errorHandler("User not found!"));
		}

		res.status(200).json(user._doc);
	} catch (error) {
		next(error);
	}
};

// export const makePremium = async (req, res, next) => {
// 	if (!req.user.isAdmin) {
// 		return next(errorHandler(403, "You are not allowed to update this user"));
// 	}

// 	const validUser = await User.findById(req.params.userId);
// 	if (!validUser) {
// 		return next(errorHandler(404, "Oops! User not found."));
// 	}

// 	try {
// 		const updatedUser = await User.findByIdAndUpdate(
// 			req.params.userId,
// 			{
// 				$set: {
// 					isPremium: true,
// 				},
// 			},
// 			{ new: true }
// 		);

// 		res.status(200).json(updatedUser._doc);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// export const makeFree = async (req, res, next) => {
// 	if (!req.user.isAdmin) {
// 		return next(errorHandler(403, "You are not allowed to update this user"));
// 	}

// 	const validUser = await User.findById(req.params.userId);
// 	if (!validUser) {
// 		return next(errorHandler(404, "Oops! User not found."));
// 	}

// 	try {
// 		const updatedUser = await User.findByIdAndUpdate(
// 			req.params.userId,
// 			{
// 				$set: {
// 					isPremium: false,
// 				},
// 			},
// 			{ new: true }
// 		);

// 		res.status(200).json(updatedUser._doc);
// 	} catch (error) {
// 		next(error);
// 	}
// };
