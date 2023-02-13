import express from "express";
import {
  createBooking,
  deleteBooking,
  getBookingByUserId,
  getHallsAvailability,
} from "../controllers/bookingHallController.js";

const router = express.Router();

router.route("/book/hall").post(createBooking);

router.route("/bookings/hall/:id").get(getBookingByUserId);

router.route("/hall/availability").post(getHallsAvailability);

router.route("/booking/hall/:id").delete(deleteBooking);

export default router;
