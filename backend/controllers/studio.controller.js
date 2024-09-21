import Studio from "../models/studio.model.js";

export const search = async (req, res) => {
  try {
    const { city, title, description, startIndex = 0, limit = 9 } = req.query;
    console.log(city, title, description, startIndex, limit);

    // Construct the search query object
    const searchQuery = {};

    if (city) {
      searchQuery.city = { $regex: city, $options: "i" }; // Case-insensitive, partial match
    }

    if (title) {
      searchQuery.title = { $regex: title, $options: "i" }; // Case-insensitive, partial match
    }

    if (description) {
      searchQuery.description = { $regex: description, $options: "i" }; // Case-insensitive, partial match
    }

    // Fetch studios from the database
    const studios = await Studio.find(searchQuery)
      .select("_id title address city images")
      .sort({ updatedAt: 1 })
      .skip(parseInt(startIndex))
      .limit(parseInt(limit));

    studios.map((studio) => {
      studio.images = studio.images[0];
      return studio;
    });

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
