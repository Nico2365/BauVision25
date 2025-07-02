
import React, { useState } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [aboGueltig, setAboGueltig] = useState(false);
  const [bild, setBild] = useState(null);
  const [baustellen, setBaustellen] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analyseErgebnis, setAnalyseErgebnis] = useState("");
  const [kategorie, setKategorie] = useState("arbeitssicherheit");

  const kategorien = {
    arbeitssicherheit: "🔐 Arbeitssicherheit",
    rechtlich: "⚖️ Rechtliche Analyse",
    technisch: "🧰 Technische Analyse",
    wirtschaftlich: "💸 Wirtschaftlichkeitsanalyse",
  };

  const handleLogin = () => {
    const regDate = new Date("2025-07-01");
    const heute = new Date();
    const diffTage = Math.floor((heute - regDate) / (1000 * 60 * 60 * 24));
    setUser({ email: loginForm.email });
    setAboGueltig(diffTage <= 30);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setBild(file);
    setAnalyseErgebnis("");
  };

  const analysieren = () => {
    if (!bild || !aboGueltig) {
      setAnalyseErgebnis("⚠️ Analyse nicht möglich – API-Zugang nicht aktiv.");
    } else {
      setAnalyseErgebnis("🔍 Analyse läuft (Schein-Ausgabe)...");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("BauVision25 Analysebericht", 20, 20);
    doc.text(`Baustelle: ${selected || "-"}`, 20, 30);
    doc.text(`Kategorie: ${kategorien[kategorie]}`, 20, 40);
    doc.text("Ergebnis:", 20, 50);
    doc.text(analyseErgebnis || "Keine Analyse durchgeführt.", 20, 60);
    doc.save("bauvision25-analyse.pdf");
  };

  if (!user) {
    return (
      <div style={{ backgroundColor: '#d1fae5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', padding: 24, borderRadius: 12 }}>
          <h2>Login – BauVision25</h2>
          <input placeholder="E-Mail" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} /><br />
          <input placeholder="Passwort" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} /><br />
          <button onClick={handleLogin}>Einloggen</button>
        </div>
      </div>
    );
  }

  if (!aboGueltig) {
    return (
      <div style={{ backgroundColor: '#fff3cd', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', padding: 24, borderRadius: 12 }}>
          <h2>🔒 Testzeitraum abgelaufen</h2>
          <p>Bitte Abo abschließen, um BauVision25 weiter zu nutzen.</p>
          <button onClick={() => alert("Bezahlfunktion folgt...")}>Abo starten</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#e6fffa', padding: 20 }}>
      <h1 style={{ color: '#065f46' }}>🏗️ BauVision25</h1>

      <h2>Baustellen</h2>
      <input placeholder="Neue Baustelle" onKeyDown={(e) => {
        if (e.key === "Enter") {
          setBaustellen([...baustellen, e.target.value]);
          e.target.value = "";
        }
      }} />
      <div>{baustellen.map((b, i) => <button key={i} onClick={() => setSelected(b)}>{b}</button>)}</div>

      <h2>Analyse-Kategorie</h2>
      {Object.entries(kategorien).map(([key, label]) => (
        <button key={key} onClick={() => setKategorie(key)}>{label}</button>
      ))}

      <h2>Bild hochladen</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={analysieren} disabled={!bild}>Bild analysieren</button>

      {analyseErgebnis && (
        <>
          <pre>{analyseErgebnis}</pre>
          <button onClick={exportPDF}>PDF exportieren</button>
        </>
      )}
    </div>
  );
}
