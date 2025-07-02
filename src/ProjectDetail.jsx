
import React from "react";

export default function ProjectDetail({ name, images, onBack, onAddImage }) {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddImage(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "#064e3b" }}>📂 Projekt: {name}</h2>
      <button onClick={onBack}>🔙 Zurück zur Übersicht</button>
      <h3>Bilder & Pläne hochladen</h3>
      <input type="file" multiple accept="image/*,.pdf" onChange={handleUpload} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
        {images.map((src, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: 5 }}>
            {src.includes("application/pdf") ? (
              <span>📄 PDF hochgeladen</span>
            ) : (
              <img src={src} alt="preview" width={100} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
