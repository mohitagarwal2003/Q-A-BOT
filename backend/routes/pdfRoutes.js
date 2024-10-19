import express from "express";
import { uploadPDF, processPDF } from "../controller/pdfController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadPDF); // Route for uploading
router.get("/process-pdf", processPDF); // Route for processing

export default router;
