import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
	createStudio,
	editStudio,
	getStudio,
	getStudioByUserId,
	search,
} from "../controllers/studio.controller.js";

const router = express.Router();

router.get("/search", search);
router.post("/create-studio/:userId", verifyToken, createStudio);
router.put("/edit-studio/:userId", verifyToken, editStudio);
router.get("/getstudio/:userId", verifyToken, getStudioByUserId);
router.get("/:studioSlug", getStudio);

export default router;
