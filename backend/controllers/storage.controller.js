import Storage from "../models/storage.model.js";

export const storeInfo = async (req, res, next) => {
	try {
		if (req.user.isAdmin) {
			const {
				backgroundImage,
				youtubeLinks,
				aboutContent,
				privacyContent,
				legalContent,
			} = req.body;

			const newStorage = new Storage({
				backgroundImage,
				youtubeLinks,
				aboutContent,
				privacyContent,
				legalContent,
			});

			await newStorage.save();

			return res.status(201).json({
				backgroundImage: newStorage.backgroundImage,
				youtubeLinks: newStorage.youtubeLinks,
				aboutContent: newStorage.aboutContent,
				privacyContent: newStorage.privacyContent,
				legalContent: newStorage.legalContent,
				found: true,
			});
		}
	} catch (error) {
		next(error);
	}
};

export const updateInfo = async (req, res, next) => {
	try {
		if (req.user.isAdmin) {
			const {
				backgroundImage,
				youtubeLinks,
				aboutContent,
				privacyContent,
				legalContent,
			} = req.body;

			const storage = await Storage.findOne();
			storage.backgroundImage = backgroundImage;
			storage.youtubeLinks = youtubeLinks;
			storage.aboutContent = aboutContent;
			storage.privacyContent = privacyContent;
			storage.legalContent = legalContent;
			const updatedStorage = await storage.save();
			//   console.log(updatedStorage);
			//   console.log(updatedStorage._doc);
			return res.status(201).json({
				backgroundImage: updatedStorage.backgroundImage,
				youtubeLinks: updatedStorage.youtubeLinks,
				aboutContent: updatedStorage.aboutContent,
				privacyContent: updatedStorage.privacyContent,
				legalContent: updatedStorage.legalContent,
				found: true,
			});
		}
	} catch (error) {
		next(error);
	}
};

export const getInfo = async (req, res, next) => {
	try {
		// Retrieve all documents from the 'Storage' collection
		const data = await Storage.find();

		// Check if any documents are found and respond accordingly
		if (data.length > 0) {
			res.json({
				backgroundImage: data[0].backgroundImage,
				youtubeLinks: data[0].youtubeLinks,
				aboutContent: data[0].aboutContent,
				privacyContent: data[0].privacyContent,
				legalContent: data[0].legalContent,
				found: true,
			});
		} else {
			res.json({
				backgroundImage: "",
				youtubeLinks: [],
				aboutContent: "",
				privacyContent: "",
				legalContent: "",
				found: false,
			});
		}
	} catch (error) {
		// Handle any errors that occur during the process
		next(error); // Pass the error to the next middleware (error handler)
	}
};
