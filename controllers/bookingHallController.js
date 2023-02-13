import BookingHall from "../models/bookingHallModel.js";
import User from "../models/userModel.js";

export const createBooking = async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.send("Room or user not found");
  }

  const userExists = await User.findById(user);

  if (!userExists) {
    return res.send("User not found");
  }

  const booking = new BookingHall(req.body);

  try {
    const createdBooking = await booking.save();
    const user = await User.findById(createdBooking.user);

    res.status(201).json({
      message: "Booking created",
      booking: {
        ...createdBooking._doc,
        user,
      },
    });
  } catch (err) {
    res.send(err.message);
  }
};

export const getBookingByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const bookings = await BookingHall.find({ user: id }).populate("user");
    res.json(bookings);
  } catch (err) {
    res.send(err.message);
  }
};

export const getHallsAvailability = async (req, res) => {
  const { bookedDate, category } = req.body;

  try {
    const halls = await BookingHall.find({
      bookedDate,
      category,
    });

    console.log(halls);

    res.json(halls);
  } catch (err) {
    res.send(err.message);
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const deletedBooking = await BookingHall.findByIdAndDelete(id);
    res.send("Deleted");
  } catch (err) {
    res.send(err.message);
  }
};
