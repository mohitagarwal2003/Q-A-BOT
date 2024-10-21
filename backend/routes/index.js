import express from "express";
import authRoutes from "./auth.js"; // Auth routes
import fileRoutes from "./fileRoutes.js"; // File management routes
import pdfRoutes from "./pdfRoutes.js"; // PDF upload and processing routes
import telegramRoutes from "./telegramRoutes.js"; // Telegram webhook routes

const router = express.Router();

// Use all the routes
router.use("/auth", authRoutes); // Routes for authentication
router.use("/", fileRoutes); // Routes for file management (upload, download, delete)
router.use("/", pdfRoutes); // Routes for PDF processing
router.use("/", telegramRoutes); // Routes for Telegram bot webhook

export default router;
