// Developed by Arnob Saha Ankon

import axios from "axios";
import React, { useState } from "react";
import "./file.css";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [fileUploaded, setFileUploaded] = useState(false); 

  // file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-file/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.message)
      setFileUploaded(true);
    } catch (error) {
      console.log("Error uploading file:",error);
      setFileUploaded(false);
    }
  };

  return (
    <div className="file-upload-section">
      <h2>Upload a PDF</h2>

        <input
          className="file-inp"
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
        />

      <button className="file-btn" onClick={handleFileUpload}>
        Upload File
      </button>
      {fileUploaded === true?(        
        <p>File uploaded successfully</p>
      ):("")
    }      
    </div>
  );
};

export default FileUpload;
