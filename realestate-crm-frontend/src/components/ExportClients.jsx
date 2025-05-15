import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/client/getAllClient')
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => console.error('Error fetching clients:', err));
  }, []);

  const handleExportClick = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "clients.xlsx");
  };

  return (
    <div>
      <h2>Client Export</h2>
      <button onClick={handleExportClick}>Export Clients to Excel</button>
    </div>
  );
};

export default ExportClients;
