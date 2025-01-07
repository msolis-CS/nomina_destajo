import React, { useState } from "react";
import axios from "axios";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://localhost:7055/api/DetalleProduccion/UploadExcel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data);
    } catch (error) {
      setMessage("Error al cargar el archivo.");
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Excel</button>
      <p>{message}</p>
    </div>
  );
};

export default UploadExcel;
