import jwt from "jsonwebtoken";
import User from "../models/user.js";
import redisClient from "../redisClient.js";

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Authorization token missing" });
//   }

//   const token = authHeader.split(" ")[1];
//   // console.log("this is authMiddleware.js: ", token);
//   // Verify the JWT token
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid token" });
//     }
//     console.log("Token verified, decoded: ", decoded);

//     // Check if token exists in Redis
//     redisClient.get(token, (err, reply) => {
//       if (err || !reply) {
//         return res.status(403).json({ message: "Token not found or expired" });
//       }

//       // Token is valid, proceed with the request
//       console.log("Token found in Redis, attaching user to request.");
//       req.user = decoded;
//       next();
//     });
//   });
// };
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Received token: ", token);

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified, decoded: ", decoded);

    // Add logging to check Redis
    console.log("Checking if token exists in Redis...");
    const reply = await redisClient.get(token);
    console.log("Redis reply: ", reply);

    if (!reply) {
      console.log("Token not found in Redis or expired.");
      return res.status(403).json({ message: "Token not found or expired" });
    }

    // Token is valid, attach user info to request
    console.log("Token found in Redis, attaching user to request.");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error in authMiddleware: ", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
