import express from "express";
const router = express.Router();
import { login, getMe } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import redisClient from "../redisClient.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
// router.post("/login", login);
router.post("/login", login);
router.get("/user/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  // Delete the token from Redis
  redisClient.del(token, (err, reply) => {
    if (err) {
      console.error("Error deleting token from Redis:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    if (reply === 0) {
      return res.status(404).json({ message: "Token not found" });
    }
    console.log("token deleted successfully from redis");
    return res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
