import Review from "../models/reviewModel.js";
// import User from "../models/userModel.js";
import BookingRoom from "../models/bookingRoomModel.js";

export const createReview = async (req, res) => {
  const userId = req.body.reviewBy;
  const bookingId = req.body.bookingId;

  const data = {
    reviewBy: userId,
    comment: req.body.comment,
    rating: req.body.rating,
  };

  const bookingRoom = await BookingRoom.findOne({ _id: bookingId });

  console.log(bookingRoom);

  if (bookingRoom.reviewGiven) {
    return res.send("You have already given a review");
  }

  const review = new Review(data);
  try {
    bookingRoom.reviewGiven = true;
    await bookingRoom.save();
    const newReview = await review.save();
    res.status(201).json({
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate("reviewBy");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopReviews = async (req, res) => {
  try {
    console.log("top reviews");
    const reviews = await Review.find().sort({ rating: -1 }).limit(5);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
