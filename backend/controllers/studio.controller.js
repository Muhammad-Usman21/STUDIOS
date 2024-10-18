import Studio from "../models/studio.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const search = async (req, res) => {
	try {
		let {
			searchTerm,
			country,
			sort,
			startIndex = 0,
			limit = 9,
			minPrice,
			maxPrice,
			benefits,
			type,
		} = req.query;

		console.log(req.query);

		if (country === "all") {
			country = null;
		}

		// Construct the search query object
		let searchQuery = {};

		// Add the searchTerm condition for city, description, title, and address
		// if (searchTerm) {
		// 	searchQuery = {
		// 		...searchQuery,
		// 		$or: [
		// 			{ title: { $regex: searchTerm, $options: "i" } },
		// 			{ type: { $regex: searchTerm, $options: "i" } },
		// 			{ description: { $regex: searchTerm, $options: "i" } },
		// 			{ address: { $regex: searchTerm, $options: "i" } },
		// 			{ city: { $regex: searchTerm, $options: "i" } },
		// 			{ state: { $regex: searchTerm, $options: "i" } },
		// 			{ country: { $regex: searchTerm, $options: "i" } },
		// 		],
		// 	};
		// }

		if (searchTerm) {
			// Split searchTerm into individual words
			const searchWords = searchTerm.split(" ");

			// Create $or array for each word, searching each word in any of the fields
			const searchConditions = searchWords.map((word) => ({
				$or: [
					{ title: { $regex: word, $options: "i" } },
					{ type: { $regex: word, $options: "i" } },
					{ address: { $regex: word, $options: "i" } },
					{ city: { $regex: word, $options: "i" } },
					{ state: { $regex: word, $options: "i" } },
					{ country: { $regex: word, $options: "i" } },
				],
			}));

			// Combine all conditions with $and so that all words must match at least one field
			searchQuery = {
				...searchQuery,
				$or: searchConditions,
			};
		}

		// Add the country condition if provided
		if (country) {
			searchQuery.country = country;
		}

		if (type && type !== "") {
			searchQuery.type = type;
		}

		// Add price range filtering
		if (minPrice || maxPrice) {
			searchQuery.price = {};
			if (minPrice) {
				searchQuery.price.$gte = parseInt(minPrice);
			}
			if (maxPrice) {
				searchQuery.price.$lte = parseInt(maxPrice);
			}
		}

		// Assuming `sort` is passed as a query parameter
		let sortOption = {};

		switch (sort) {
			case "desc":
				sortOption = { createdAt: -1 }; // Latest Studio
				break;
			case "asc":
				sortOption = { createdAt: 1 }; // Oldest Studio
				break;
			case "priceDesc":
				sortOption = { price: -1 }; // Highest Price
				break;
			case "priceAsc":
				sortOption = { price: 1 }; // Lowest Price
				break;
			case "facilityDesc":
				sortOption = {
					"facility.remote": -1,
					"facility.parking": -1,
					"facility.wifi": -1,
					"facility.air": -1,
				}; // Most Benefits
				break;
			case "facilityAsc":
				sortOption = {
					"facility.remote": 1,
					"facility.parking": 1,
					"facility.wifi": 1,
					"facility.air": 1,
				}; // Least Benefits
				break;
			default:
				sortOption = { createdAt: -1 }; // Default to Latest Studio
		}

		// Add benefits filter if provided
		if (benefits && benefits.length > 0) {
			const benefitsList = benefits
				.split(",")
				.map((benefit) => benefit.trim())
				.filter((benefit) => benefit !== "");
			console.log(benefitsList);
			benefitsList.forEach((benefit) => {
				searchQuery[`facility.${benefit}`] = true; // Search studios where this facility is true
			});
		}

		// Fetch studios from the database
		const studios = await Studio.find(searchQuery)
			.select(
				"_id title address city images price benefits facility studioSlug"
			)
			.sort(sortOption)
			.skip(parseInt(startIndex))
			.limit(parseInt(limit));
		res.status(200).json(studios);
	} catch (error) {
		console.error("Error searching for studios:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getStudio = async (req, res) => {
	const { studioSlug } = req.params; // Change to studioSlug
	try {
		// Find the studio by its slug
		const studio = await Studio.findOne({ studioSlug }).populate(
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
		mail,
	} = req.body;

	// Replace all spaces in the studio title with dashes
	const formattedTitle = title.replace(/\s+/g, "-");
	// Extract the part of the email before the '@'
	const emailUsername = mail.split("@")[0];
	// Combine the title, the word 'by', and the email username
	const slug = `${formattedTitle}-by-${emailUsername}`;
	const studioSlug = slug.replace(/\./g, "");

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
			studioSlug,
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
		mail,
	} = req.body;

	// Replace all spaces in the studio title with dashes
	const formattedTitle = title.replace(/\s+/g, "-");
	// Extract the part of the email before the '@'
	const emailUsername = mail.split("@")[0];
	// Combine the title, the word 'by', and the email username
	const slug = `${formattedTitle}-by-${emailUsername}`;
	const studioSlug = slug.replace(/\./g, "");

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
		if (title) existingStudio.studioSlug = studioSlug;
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
