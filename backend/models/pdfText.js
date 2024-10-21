import mongoose from "mongoose";

const pdfTextSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const PDFText = mongoose.model("PDFText", pdfTextSchema);
