
import React, { useState } from "react";

export default function Upload({ lang }) {
  const [images, setImages] = useState([]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files.map(f => URL.createObjectURL(f))]);
  };

  return (
    <div>
      <h2>{lang === "de" ? "📷 Bilder & Pläne hochladen" : "📷 Upload Images & Plans"}</h2>
      <input type="file" accept="image/*,.pdf" multiple onChange={handleUpload} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
        {images.map((src, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: 5 }}>
            {src.endsWith(".pdf") ? <span>📄 PDF</span> : <img src={src} alt="preview" width={100} />}
          </div>
        ))}
      </div>
    </div>
  );
}
