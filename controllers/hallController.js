import Hall from "../models/hallModel.js";

export const getHalls = async (req, res) => {
  const halls = await Hall.find({});
  res.json(halls);
};

export const getHallByCategory = async (req, res) => {
  const { category } = req.params;

  const hall = await Hall.find({ category });

  res.json(hall);
};
