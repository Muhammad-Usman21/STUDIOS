import Studio from "../models/studio.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const search = async (req, res) => {
	try {
		let { searchTerm, country, sort, startIndex = 0, limit = 9 } = req.query;

		if (country === "all") {
			country = null;
		}

		// Construct the search query object
		let searchQuery = {};

		// Add the searchTerm condition for city, description, title, and address
		if (searchTerm) {
			searchQuery = {
				...searchQuery,
				$or: [
					{ title: { $regex: searchTerm, $options: "i" } },
					{ type: { $regex: searchTerm, $options: "i" } },
					{ description: { $regex: searchTerm, $options: "i" } },
					{ address: { $regex: searchTerm, $options: "i" } },
					{ city: { $regex: searchTerm, $options: "i" } },
					{ state: { $regex: searchTerm, $options: "i" } },
					{ country: { $regex: searchTerm, $options: "i" } },
				],
			};
		}

		if (country) {
			searchQuery.country = country;
		}

		// Fetch studios from the database
		const studios = await Studio.find(searchQuery)
			.select("_id title address city images")
			.sort({ updatedAt: sort })
			.skip(parseInt(startIndex))
			.limit(parseInt(limit));

		res.status(200).json(studios);
	} catch (error) {
		console.error("Error searching for studios:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getStudio = async (req, res) => {
	const { studioId } = req.params;
	try {
		const studio = await Studio.findById(studioId).populate(
			"userId",
			"name email profilePicture"
		);
		if (!studio) {
			return res.status(404).json({ message: "Studio not found." });
		}
		res.status(200).json(studio);
	} catch (error) {
		console.error("Error fetching studio:", error);
		res.status(500).json({ message: "Failed to fetch studio." });
	}
};

// Create a new studio
export const createStudio = async (req, res) => {
	const {
		title,
		phone,
		images,
		address,
		city,
		state,
		country,
		price,
		type,
		facility,
		socialMedia,
		calendarUrl,
		location,
		description,
	} = req.body;

	const { userId } = req.params;
	try {
		// Check if studio already exists for this user
		const existingStudio = await Studio.findOne({ userId });
		if (existingStudio) {
			return res
				.status(400)
				.json({ message: "Studio already exists for this user." });
		}

		// Create a new Studio
		const newStudio = new Studio({
			userId: new mongoose.Types.ObjectId(userId),
			title,
			phone,
			images,
			address,
			city,
			state,
			country,
			price,
			type,
			facility,
			socialMedia,
			calendarUrl,
			location,
			description,
		});

		// Save to the database
		await newStudio.save();

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $set: { isStudio: true } },
			{ new: true }
		);

		res.status(201).json({
			message: "Studio created successfully!",
			studio: newStudio,
			user: updatedUser,
		});
	} catch (error) {
		console.error("Error creating studio:", error);
		res.status(500).json({ message: "Failed to create studio." });
	}
};

// Edit an existing studio
export const editStudio = async (req, res) => {
	const { userId } = req.params; // The userId will come from the route params
	const {
		title,
		phone,
		images,
		address,
		city,
		state,
		country,
		price,
		facility,
		type,
		socialMedia,
		calendarUrl,
		location,
		description,
	} = req.body;

	try {
		// Check if studio exists for this user
		const existingStudio = await Studio.findOne({ userId });
		if (!existingStudio) {
			return res
				.status(404)
				.json({ message: "Studio not found for this user." });
		}

		// Update the studio fields with the new values (if provided)
		if (title) existingStudio.title = title;
		if (phone) existingStudio.phone = phone;
		if (images) existingStudio.images = images;
		if (address) existingStudio.address = address;
		if (city) existingStudio.city = city;
		if (state) existingStudio.state = state;
		if (facility) existingStudio.facility = facility;
		if (type) existingStudio.type = type;
		if (country) existingStudio.country = country;
		if (socialMedia) existingStudio.socialMedia = socialMedia;
		if (calendarUrl) existingStudio.calendarUrl = calendarUrl;
		if (location) existingStudio.location = location;
		if (description) existingStudio.description = description;
		if (price) existingStudio.price = price;

		// Save the updated studio
		await existingStudio.save();

		res.status(200).json({
			message: "Studio updated successfully!",
			studio: existingStudio,
		});
	} catch (error) {
		console.error("Error updating studio:", error);
		res.status(500).json({ message: "Failed to update studio." });
	}
};

// Controller to get studio by user ID
export const getStudioByUserId = async (req, res) => {
	try {
		const { userId } = req.params; // Assuming the userId is passed in the request parameters

		const studios = await Studio.find({ userId });

		if (studios.length === 0) {
			return res
				.status(404)
				.json({ message: "No studios found for this user" });
		}

		res.status(200).json(studios[0]);
	} catch (error) {
		res.status(500).json({ error: "Error fetching studio by user ID" });
	}
};
