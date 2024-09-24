import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		studioId: {
			type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing the Post model
			ref: "Studio", // Reference the Post model
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing the User model
			ref: "User", // Reference the User model
			required: true,
		},
		likes: {
			type: Array,
			default: [],
		},
		numberOfLikes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
