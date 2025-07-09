import React, { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const [projektName, setProjektName] = useState("");
  const [projekte, setProjekte] = useState([]);
  const [selectedProjekt, setSelectedProjekt] = useState(null);
  const [bilder, setBilder] = useState([]);

  useEffect(() => {
    const gespeicherteProjekte = JSON.parse(localStorage.getItem("projekte")) || [];
    setProjekte(gespeicherteProjekte);
  }, []);

  useEffect(() => {
    localStorage.setItem("projekte", JSON.stringify(projekte));
  }, [projekte]);

  const login = () => setUser("demo@bauvision.de");

  const neuesProjekt = () => {
    if (projektName && !projekte.find(p => p.name === projektName)) {
      setProjekte([...projekte, { name: projektName, bilder: [] }]);
      setProjektName("");
    }
  };

  const projektWaehlen = (name) => {
    const proj = projekte.find(p => p.name === name);
    setSelectedProjekt(proj);
    setBilder(proj?.bilder || []);
  };

  const bilderHinzufuegen = (e) => {
    const files = Array.from(e.target.files);
    setBilder([...bilder, ...files]);
    const aktualisiert = projekte.map(p =>
      p.name === selectedProjekt.name ? { ...p, bilder: [...p.bilder, ...files] } : p
    );
    setProjekte(aktualisiert);
  };

  if (!user) {
    return (
      <div style={{ padding: 40, backgroundColor: "#e6ffe6", minHeight: "100vh" }}>
        <h2>Login zur BauVision25</h2>
        <button onClick={login}>Einloggen</button>
      </div>
    );
  }

  if (!selectedProjekt) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Projektübersicht</h2>
        <input value={projektName} onChange={(e) => setProjektName(e.target.value)} placeholder="Projektname" />
        <button onClick={neuesProjekt}>Projekt anlegen</button>
        <ul>
          {projekte.map((p, i) => (
            <li key={i}><button onClick={() => projektWaehlen(p.name)}>{p.name}</button></li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Projekt: {selectedProjekt.name}</h2>
      <input type="file" multiple onChange={bilderHinzufuegen} />
      <ul>
        {bilder.map((b, i) => <li key={i}>{b.name || "Bild"}</li>)}
      </ul>
      <button onClick={() => setSelectedProjekt(null)}>Zurück zur Übersicht</button>
    </div>
  );
}
