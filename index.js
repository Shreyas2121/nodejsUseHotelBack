import express from "express";
import connectDb from "./connectDb.js";
import dotenv from "dotenv";
import cors from "cors";

import userRoute from "./routes/userRoute.js";
import couponRoute from "./routes/couponRoute.js";
import roomRoute from "./routes/roomRoutes.js";
import hallRoute from "./routes/hallRoute.js";
import addonRoute from "./routes/addonRoute.js";
import reviewRoute from "./routes/reviewRoutes.js";
import bookingRoomRoute from "./routes/bookingRoomRoutes.js";
import bookingHallRoute from "./routes/bookingHallRoute.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.URL,
  })
);
app.use(express.json());

connectDb();

app.use("/api/", userRoute);
app.use("/api/", couponRoute);
app.use("/api/", roomRoute);
app.use("/api/", hallRoute);
app.use("/api/", addonRoute);
app.use("/api/", reviewRoute);
app.use("/api/", bookingRoomRoute);
app.use("/api/", bookingHallRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
