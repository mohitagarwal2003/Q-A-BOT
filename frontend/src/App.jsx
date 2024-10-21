import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import UserProfile from "./UserProfile";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState("");
  const [user, setUser] = useState(null); // Add user state for authentication

  useEffect(() => {
    // Fetch the list of uploaded files when the component mounts
    axios.get("/api/files").then((response) => {
      setFiles(response.data);
    });
    // Check if user is already logged in
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
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
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data in local storage
  };

  // const handleLogout = async () => {
  //   try {
  //     const token = localStorage.getItem("token"); // Get the token from local storage
  //     if (token) {
  //       // Call the logout API
  //       const response = await axios.post(
  //         "/api/auth/logout",
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Send the token in the header
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         console.log("Logout successful");
  //         setUser(null);
  //         localStorage.removeItem("user"); // Clear user data from local storage
  //         localStorage.removeItem("token"); // Clear token from local storage
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //   }
  // };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user data from local storage
  };
  return (
    <div className="container">
      {!user ? ( // Show login form if user is not logged in
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <UserProfile user={user} onLogout={handleLogout} />{" "}
          {/* User profile section */}
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
            <br />
            <br />
            <div>
              <button onClick={handleGetChatGPTResponse}>
                Get ChatGPT Response
              </button>
              <p>Response from ChatGPT: {response}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
