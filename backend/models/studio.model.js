import mongoose from "mongoose";

const studioSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
		ref: "User",
	},
	title: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	images: [
		{
			name: { type: String, required: true },
			url: { type: String, required: true },
		},
	],
	address: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	socialMedia: {
		instagram: { type: String },
		twitter: { type: String },
		facebook: { type: String },
		whatsapp: { type: String },
	},
	week: {
		monday: {
			start: { type: String }, // Time in format "HH:mm" or use Date type
			end: { type: String },
			working: { type: Boolean, default: false }, // Indicates if it's a working day
		},
		tuesday: {
			start: { type: String },
			end: { type: String },
			working: { type: Boolean, default: false }, // Indicates if it's a working day
		},
		wednesday: {
			start: { type: String },
			end: { type: String },
			working: { type: Boolean, default: false }, // Indicates if it's a working day
		},
		thursday: {
			start: { type: String },
			end: { type: String },
			working: { type: Boolean, default: false }, // Indicates if it's a working day
		},
		friday: {
			start: { type: String },
			end: { type: String },
			working: { type: Boolean, default: false }, // Indicates if it's a working day
		},
		saturday: {
			start: { type: String },
			end: { type: String },
			working: { type: Boolean, default: false }, // Indicates if it's a working day
		},
		sunday: {
			start: { type: String },
			end: { type: String },
			working: { type: Boolean, default: false }, // Indicates if it's a working day
		},
	},
	location: {
		longitude: { type: String, required: true },
		latitude: { type: String, required: true },
	},
	description: {
		type: String,
		required: true,
	},
});

const Studio = mongoose.model("Studio", studioSchema);

export default Studio;
