import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	googleId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	profilePicture: {
		type: String,
		required: true,
	},
	accessToken: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	isStudio: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.model("User", userSchema);

export default User;
