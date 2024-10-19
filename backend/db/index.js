import mongoose from "mongoose";
import User from "../models/user.js";
// import dotenv from "dotenv";

// dotenv.config({
//   path: "../.env",
// });
const connectdb = async () => {
  console.log("mongodb://localhost:27017/harryKart");
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb://localhost:27017/harryKart"
    );
    console.log(
      `MONGODB SUCCESSFULLY CONNECTED || DB HOST : ${connectionInstance.connection.host}`
    );

    // Now, try to find the user
    const user = await User.findOne({ email: "ma2003agarwal@gmail.com" });
    if (!user) {
      console.log("User not found");
      return;
    }

    // Testing password matching
    const isMatch = await user.matchPassword("mohit.in"); // Use the actual password
    console.log("Testing password match:", isMatch); // Should log true if the password matches
  } catch (error) {
    console.log("Error is occured in connection of DB", error);
    process.exit(1);
  }
};

export default connectdb;
