import express from "express";

import {
  createBooking,
  getFreeBusy,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/create", createBooking);

router.get("/freebusy", getFreeBusy);

export default router;
