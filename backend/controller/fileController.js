import { Storage } from "@google-cloud/storage";

const storage = new Storage({ keyFilename: "key.json" });
const bucket = storage.bucket("mohitagarwal");

// List all files in GCP bucket
export const getAllFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const fileNames = files.map((file) => file.name);
    // console.log(fileNames);
    res.json(fileNames);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Error fetching files from storage.");
  }
};

// Download a file from GCP bucket
export const downloadFile = (req, res) => {
  const fileName = req.params.fileName;
  const file = bucket.file(fileName);

  try {
    file
      .createReadStream()
      .on("error", (err) => {
        console.error("Error reading file:", err);
        res.status(500).send("Error downloading file.");
      })
      .pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Error downloading file.");
  }
};

// Delete a file from GCP bucket
export const deleteFile = async (req, res) => {
  const fileName = req.body.fileName;

  if (!fileName) {
    return res.status(400).send("Filename is required.");
  }

  const file = bucket.file(fileName);

  try {
    await file.delete();
    res.send("File deleted");
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send("Error deleting file.");
  }
};
