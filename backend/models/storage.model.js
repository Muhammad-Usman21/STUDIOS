import mongoose from "mongoose";

const storageSchema = new mongoose.Schema(
	{
		backgroundImage: {
			type: String,
		},
		youtubeLinks: {
			type: Array,
			default: [],
		},
		aboutContent: {
			type: String,
		},
		privacyContent: {
			type: String,
		},
		legalContent: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Storage = mongoose.model("Storage", storageSchema);

export default Storage;
