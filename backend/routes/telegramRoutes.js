import express from "express";
import {handleWebhook} from "../controller/telegramController.js"; // Import the controller

const router = express.Router();

// Define the POST route for the Telegram webhook
router.post("/webhook", handleWebhook);

export default router;
