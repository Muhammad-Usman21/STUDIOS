import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
	countTotalCommentsByStudio,
	countTotalCommentsByUser,
	createComment,
	deleteComment,
	editComment,
	getAllCommentsByUser,
	getComments,
	getPostComments,
	likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create-comment", verifyToken, createComment);
router.get("/get-postComments", getPostComments);
router.put("/like-comment/:commentId", verifyToken, likeComment);
router.put("/edit-comment/:commentId", verifyToken, editComment);
router.delete("/delete-comment/:commentId", verifyToken, deleteComment);
router.get("/get-comments", verifyToken, getComments);
router.get("/getAllCommentsByUser", verifyToken, getAllCommentsByUser);
router.get(
	"/countTotalCommentsByUser/:userId",
	verifyToken,
	countTotalCommentsByUser
);
router.get(
	"/countTotalCommentsByStudio/:studioId",
	verifyToken,
	countTotalCommentsByStudio
);

export default router;
