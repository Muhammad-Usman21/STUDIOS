import express from "express";
import {
	updateUser,
	getUsers,
	getUser,
	// makePremium,
	// makeFree,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.get("/getusers", verifyToken, getUsers);
router.get("/getuser/:userId", verifyToken, getUser);
// router.put("/makePremium/:userId", verifyToken, makePremium);
// router.put("/makeFree/:userId", verifyToken, makeFree);

export default router;
