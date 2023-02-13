import mongoose from "mongoose";

const bookingHallSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  bookingDate: {
    type: Date,
    required: true,
  },

  bookedDate: {
    type: Date,
    required: true,
  },

  basePrice: {
    type: Number,
    required: true,
  },

  selectedAddOns: {
    type: {},
  },

  category: {
    type: String,
    required: true,
  },

  coupon: {
    type: {},
  },

  specialRequest: {
    type: String,
  },

  total: {
    type: Number,
    required: true,
  },

  reviewGiven: {
    type: Boolean,
    default: false,
  },
});

const BookingHall = mongoose.model("BookingHall", bookingHallSchema);

export default BookingHall;
