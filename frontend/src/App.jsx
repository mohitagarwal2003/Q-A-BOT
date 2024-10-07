import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    // Fetch the list of uploaded files when the component mounts
    axios.get("/api/files").then((response) => {
      setFiles(response.data);
    });
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload on button click
  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("File uploaded successfully!");
        setFiles((prevFiles) => [...prevFiles, response.data.fileName]);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
      });
  };

  // Handle file download
  const handleDownload = (fileName) => {
    axios
      .get(`/api/download/${fileName}`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  // Handle file deletion
  const handleDelete = (fileName) => {
    axios
      .post("/api/delete", { fileName })
      .then((response) => {
        alert("File deleted successfully!");
        setFiles((prevFiles) => prevFiles.filter((file) => file !== fileName));
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };
  //<-------------chatgpt---------------->
  const handleGetChatGPTResponse = async () => {
    try {
      const { data } = await axios.get("/api/process-pdf");
      setResponse(data.gptResponse); // Set ChatGPT's response in state
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error getting ChatGPT response");
    }
  };

  return (
    <div className="container">
      <h1>Uploaded Files</h1>
      <table>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Download</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file}>
              <td>{file}</td>
              <td>
                <button
                  className="download-btn"
                  onClick={() => handleDownload(file)}
                >
                  Download
                </button>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(file)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} className="upload-btn">
          Upload
        </button>
        <br /><br />
        <div>
          <button onClick={handleGetChatGPTResponse}>
            Get ChatGPT Response
          </button>
          <p>Response from ChatGPT: {response}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
