import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
	createStudio,
	editStudio,
	getStudio,
	getStudioByUserId,
	search,
} from "../controllers/studio.controller.js";

const router = express.Router();

router.get("/search", search);
router.post("/create-studio/:userId", verifyUser, createStudio);
router.put("/edit-studio/:userId", verifyUser, editStudio);
router.get("/getstudio/:userId", verifyUser, getStudioByUserId);
router.get("/:studioId", getStudio);

export default router;
