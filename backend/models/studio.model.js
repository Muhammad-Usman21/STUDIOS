import mongoose from "mongoose";

const studioSchema = new mongoose.Schema(
	{
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
		state: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		facility: {
			remote: { type: Boolean, default: false },
			parking: { type: Boolean, default: false },
			wifi: { type: Boolean, default: false },
			air: { type: Boolean, default: false },
		},
		socialMedia: {
			instagram: { type: String },
			twitter: { type: String },
			facebook: { type: String },
			whatsapp: { type: String },
		},
		calendarUrl: {
			type: String,
			required: true,
		},
		location: {
			latitude: { type: String, required: true },
			longitude: { type: String, required: true },
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Studio = mongoose.model("Studio", studioSchema);

export default Studio;
