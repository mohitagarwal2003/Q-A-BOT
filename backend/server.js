import express from "express";
import connectdb from "../backend/db/index.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import telegramRoutes from "./routes/telegramRoutes.js";

dotenv.config({
  path: "./.env",
});
console.log("test" + process.env.MONGODB_URI);

const app = express();
app.use(express.json());
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf.toString(encoding || "utf8");
    },
  })
);

app.use(express.static("dist"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
//-------------------connection with db-----------
connectdb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

app.use("/api", pdfRoutes);
app.use("/api", fileRoutes);
app.use("/api", telegramRoutes);

// const newUser = new User({
//   name: "karan",
//   email: "karan@example.com",
//   password: "karan.in", // This will be hashed before saving
// });
//   console.log('User added');
//  newUser.save();
