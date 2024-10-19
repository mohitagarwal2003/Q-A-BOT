import { PDFText } from "../models/pdfText.js"; // Importing the model
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import pdfParse from "pdf-parse";
import axios from "axios";
import multer from "multer";


const storage = new Storage({
  keyFilename: "key.json",
});
// const upload = multer({ storage: multer.memoryStorage() });
const bucketName = "mohitagarwal";
const bucket = storage.bucket(bucketName);

// Upload and parse PDF
export const uploadPDF = async (req, res) => {
  const file = req.file;
  console.log(file);
  if (!file) {
    return res.status(400).send("file not uploaded");
  }

  const fileName = Date.now() + "-" + file.originalname;

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });
  blobStream.on("error", (err) => {
    console.error("Error uploading file:", err); // Log the error
    return res.status(500).send(err);
  });
  blobStream.on("finish", async () => {
    // Automatically parse the PDF after upload
    try {
      // console.log(fileName);
      const localFilePath = await downloadPDF(fileName); // Download the PDF locally
      // console.log(localFilePath);
      const dataBuffer = fs.readFileSync(localFilePath); // Read the local file
      // console.log(dataBuffer);
      const pdfData = await pdfParse(dataBuffer); // Parse the PDF

      // Store text in MongoDB
      const pdfRecord = new PDFText({
        fileName: fileName,
        text: pdfData.text,
      });

      await pdfRecord.save(); // Save the parsed text to MongoDB

      res.json({
        message: "PDF uploaded, parsed, and text stored.",
        id: pdfRecord._id,
      });
    } catch (error) {
      console.error("Error parsing or storing PDF text:", error);
      res.status(500).send("Error processing PDF.");
    }
  });
  blobStream.end(file.buffer);
};

// Fetch parsed PDF text and send to OpenAI
export const processPDF = async (req, res) => {
  try {
    const pdfRecord = await PDFText.findOne().sort({ createdAt: -1 }); // Get latest parsed PDF text
    if (!pdfRecord)
      return res.status(404).send("No PDF text found in database");

    const gptResponse = await sendToChatGPT(pdfRecord.text); // Send text to ChatGPT API
    res.json({ message: "Success", gptResponse });
  } catch (error) {
    res.status(500).send("Error processing text.");
  }
};

// Helper to send text to OpenAI
const sendToChatGPT = async (text) => {
  const apiKey = process.env.OPENAI_API_KEY;
  // console.log(apiKey);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      { model: "gpt-3.5-turbo", messages: [{ role: "user", content: text }] },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    throw new Error("ChatGPT API failed");
  }
};

// Download PDF from GCP bucket
const downloadPDF = async (fileName) => {
  const file = bucket.file(fileName);
  const localFilePath = `./${fileName}`; // Define the local path to store the PDF
  await file.download({ destination: localFilePath });
  console.log(`Downloaded ${fileName} from GCS to ${localFilePath}.`);
  return localFilePath; // Return the local file path for parsing
};
