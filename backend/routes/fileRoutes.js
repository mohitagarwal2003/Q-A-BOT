import express from "express";
import {
  getAllFiles,
  downloadFile,
  deleteFile,
} from "../controller/fileController.js";

const router = express.Router();

router.get("/files", getAllFiles); // Route to list all files
router.get("/download/:fileName", downloadFile); // Route to download a specific file
router.post("/delete", deleteFile); // Route to delete a specific file

export default router;
