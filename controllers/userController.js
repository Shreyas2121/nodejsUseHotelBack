import User from "../models/userModel.js";

export const loginUser = async (req, res) => {
  const user = req.body;

  const userExists = await User.findOne({ email: user.email });

  if (userExists && (await userExists.matchPassword(user.password))) {
    res.json({
      message: "Login successful",
      user: userExists,
    });
  } else {
    res.status(401).send("Invalid email or password");
  }
};

export const registerUser = async (req, res) => {
  const user = req.body;

  const userExists = await User.findOne({ email: user.email });

  if (userExists) {
    res.status(400).send("User already exists");
  }

  const createdUser = await User.create(user);

  if (user) {
    res.status(201).json({
      message: "User created successfully",
    });
  } else {
    res.status(400).send("Invalid user data");
  }
};

export const logoutUser = async (req, res) => {
  res.send("Logout");
};
