import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportProperties = () => {
  const [properties, setProperties] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    axios.get('http://localhost:5001/api/property/getAllProperty')
      .then(res => {
        const formatted = res.data.properties.map((property) => ({
          ...property,
          amenities: JSON.parse(property.amenities).join(', ') // Convert JSON string to readable text
        }));
        setProperties(formatted);
      })
      .catch(err => console.error('Error fetching properties:', err));
  }, []);

  // Function to export data
  const handleExportClick = () => {
    const worksheet = XLSX.utils.json_to_sheet(properties);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "properties.xlsx");
  };

  return (
    <div>
      <h2>Property Export</h2>
      <button onClick={handleExportClick}>Export Properties to Excel</button>
    </div>
  );
};

export default ExportProperties;
