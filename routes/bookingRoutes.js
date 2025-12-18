import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookedSeats,
  cancelBooking
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/all", protect, admin, getAllBookings);
router.get("/booked-seats", getBookedSeats);
router.put("/:id/cancel", protect, cancelBooking);

export default router;
