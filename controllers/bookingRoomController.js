import BookingRoom from "../models/bookingRoomModel.js";
import Room from "../models/roomModel.js";
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

  const booking = new BookingRoom(req.body);

  try {
    const createdBooking = await booking.save();
    const user = await User.findById(createdBooking.user);
    console.log(createdBooking);
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

export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingRoom.find({})
    .populate("user");
    res.json(bookings);
  } catch (err) {
    res.send(err.message);
  }
};

export const getBookingByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const bookings = await BookingRoom.find({ user: id }).populate("user");
    res.json(bookings);
  } catch (err) {
    res.send(err.message);
  }
};

// export const getRoomAvailability = async (req, res) => {
//   const { checkIn, checkOut } = req.body;

//   const parsedCheckIn = new Date(checkIn);
//   const parsedCheckOut = new Date(checkOut);

//   if (!checkIn || !checkOut) {
//     return res.send("Check in or check out date not found");
//   }

//   if (parsedCheckIn > parsedCheckOut) {
//     return res.send("Check in date cannot be greater than check out date");
//   }

//   try {
//     const bookingRoomCheckin = await BookingRoom.find({
//       checkIn: { $lte: parsedCheckIn },
//       checkOut: { $gt: parsedCheckIn },
//     });

//     // console.log(bookingRoomCheckin);

//     const bookingRoomCheckout = await BookingRoom.find({
//       checkIn: { $lt: parsedCheckOut },
//       checkOut: { $gte: parsedCheckOut },
//     });

//     // console.log(bookingRoomCheckout);

//     const bookingRoomBetween = await BookingRoom.find({
//       checkIn: { $gte: parsedCheckIn },
//       checkOut: { $lte: parsedCheckOut },
//     });

//     // console.log(bookingRoomBetween);

//     const bookingRoom = bookingRoomCheckin.concat(
//       bookingRoomCheckout,
//       bookingRoomBetween
//     );

//     // console.log(bookingRoom);

//     const rooms = await Room.find({});

//     let availableRooms = {};

//     rooms.forEach((room) => {
//       availableRooms[room["category"]] = room["total_rooms"];
//     });

//     console.log("Available Rooms: ", availableRooms);

//     let bookedRoomType = {};

//     bookingRoom.forEach((booking) => {
//       if (bookedRoomType[booking["room"]["category"]]) {
//         bookedRoomType[booking["room"]["category"]] += booking["numOfRooms"];
//       } else {
//         bookedRoomType[booking["room"]["category"]] = booking["numOfRooms"];
//       }
//     });

//     for (const [key, value] of Object.entries(bookedRoomType)) {
//       availableRooms[key] -= value;
//     }

//     res.send(availableRooms);
//   } catch (err) {
//     res.send(err.message);
//   }
// };

// export const getRoomAvailability = async (req, res) => {
//   const { checkIn, checkOut } = req.body;

//   const parsedCheckIn = new Date(checkIn);
//   const parsedCheckOut = new Date(checkOut);

//   if (!checkIn || !checkOut) {
//     return res.send("Check in or check out date not found");
//   }

//   if (parsedCheckIn > parsedCheckOut) {
//     return res.send("Check in date cannot be greater than check out date");
//   }

//   try {
//     const rooms = await Room.find({});
//     const roomCategories = rooms.map((room) => room.category);
//     const roomCategoryCounts = rooms.reduce((acc, room) => {
//       acc[room.category] = room.total_rooms;
//       return acc;
//     }, {});

//     const bookings = await BookingRoom.find({
//       $or: [
//         { checkIn: { $lte: parsedCheckIn, $gt: parsedCheckOut } },
//         { checkOut: { $lt: parsedCheckIn, $gte: parsedCheckOut } },
//         {
//           checkIn: { $gte: parsedCheckIn },
//           checkOut: { $lte: parsedCheckOut },
//         },
//       ],
//     });

//     const bookedRoomCounts = bookings.reduce((acc, booking) => {
//       if (acc[booking.room.category]) {
//         acc[booking.room.category] += booking.numOfRooms;
//       } else {
//         acc[booking.room.category] = booking.numOfRooms;
//       }
//       return acc;
//     }, {});

//     const availableRoomCounts = roomCategories.reduce((acc, category) => {
//       acc[category] =
//         roomCategoryCounts[category] - (bookedRoomCounts[category] || 0);
//       return acc;
//     }, {});

//     console.log(availableRoomCounts);

//     res.send(availableRoomCounts);
//   } catch (err) {
//     res.send(err.message);
//   }
// };

export const getRoomAvailability = async (req, res) => {
  const { checkIn, checkOut } = req.body;
  const parsedCheckIn = new Date(checkIn);
  const parsedCheckOut = new Date(checkOut);

  if (!checkIn || !checkOut) {
    return res
      .status(400)
      .send({ error: "Check in or check out date not found" });
  }

  if (parsedCheckIn >= parsedCheckOut) {
    return res.status(400).send({
      error: "Check in date cannot be greater than or equal to check out date",
    });
  }

  try {
    const rooms = await Room.find({});
    const roomCategories = rooms.map((room) => room.category);

    const roomCategoryCounts = rooms.reduce((counts, room) => {
      counts[room.category] = room.total_rooms;
      return counts;
    }, {});

    const bookings = await BookingRoom.find({
      checkIn: { $lte: parsedCheckOut },
      checkOut: { $gte: parsedCheckIn },
    });

    const bookedRoomCounts = bookings.reduce((counts, booking) => {
      counts[booking.category] =
        (counts[booking.category] || 0) + booking.numOfRooms;
      return counts;
    }, {});

    const availableRoomCounts = roomCategories.reduce((counts, category) => {
      counts[category] =
        roomCategoryCounts[category] - (bookedRoomCounts[category] || 0);
      return counts;
    }, {});

    res.send(availableRoomCounts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const deletedBooking = await BookingRoom.findByIdAndDelete(id);
    res.send("Deleted");
  } catch (err) {
    res.send(err.message);
  }
};
