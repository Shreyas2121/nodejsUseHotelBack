import express from "express";
import { getHalls, getHallByCategory } from "../controllers/hallController.js";

const router = express.Router();

router.route("/halls").get(getHalls);

router.route("/halls/:category").get(getHallByCategory);

export default router;
