import redis from "redis";

// Create Redis client
const redisClient = redis.createClient({
  url: "redis://localhost:6379", // Ensure this matches your Redis server URL

  // host: "127.0.0.1", // or your Redis server's IP if remote
  // port: 6379, // default Redis port
});

// Handle connection events
// redisClient.on("connect", () => {
//   console.log("Connected to Redis");
// });

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
(async () => {
  await redisClient.connect();
})();
 
// Export the Redis client
export default redisClient;
