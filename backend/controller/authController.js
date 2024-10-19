import User from "../models/user.js";
import jwt from "jsonwebtoken";
import redisClient from "../redisClient.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log("Password match result for user:", isMatch); // Log password match result
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // Store token in Redis with an expiration time (optional)
    console.log("Storing token in Redis...");
    await redisClient.set(token, 3600, JSON.stringify(user._id)); // Expires in 1 hour
    console.log("Token stored successfully:", token);

    console.log("User loggedIn");
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
const getMe = async (req, res) => {
  try {
    console.log("User retrieved from middleware: ", req.user);
    // const user = req.user; // `req.user` is populated by the protect middleware

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in /user/me:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { login, getMe };
