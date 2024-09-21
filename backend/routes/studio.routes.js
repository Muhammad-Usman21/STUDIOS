import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createStudio, editStudio } from "../controllers/studio.controller.js";

const router = express.Router();

router.post("/create-studio/:userId", verifyUser, createStudio);
router.put("/edit-studio/:userId", verifyUser, editStudio);

export default router;
