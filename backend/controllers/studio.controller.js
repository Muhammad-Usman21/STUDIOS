// Create a new studio
export const createStudio = async (req, res) => {
	const {
		userId,
		title,
		phone,
		images,
		address,
		city,
		country,
		socialMedia,
		week,
		location,
		description,
	} = req.body;

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
			userId: mongoose.Types.ObjectId(userId), // Ensures that userId is stored as ObjectId
			title,
			phone,
			images,
			address,
			city,
			country,
			socialMedia,
			week,
			location,
			description,
		});

		// Save to the database
		await newStudio.save();

		res
			.status(201)
			.json({ message: "Studio created successfully!", studio: newStudio });
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
		country,
		socialMedia,
		week,
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
		if (country) existingStudio.country = country;
		if (socialMedia) existingStudio.socialMedia = socialMedia;
		if (week) existingStudio.week = week;
		if (location) existingStudio.location = location;
		if (description) existingStudio.description = description;

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
