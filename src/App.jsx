
import React, { useState } from "react";
import Dashboard from "./Dashboard.jsx";
import Account from "./Account.jsx";
import Upload from "./Upload.jsx";
import LanguageSwitch from "./LanguageSwitch.jsx";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lang, setLang] = useState("de");

  const nav = {
    de: { dashboard: "Übersicht", upload: "Bilder", account: "Konto", lang: "Sprache" },
    en: { dashboard: "Dashboard", upload: "Upload", account: "Account", lang: "Language" }
  };

  return (
    <div style={{ fontFamily: 'Arial', background: '#ecfdf5', minHeight: '100vh', padding: 20 }}>
      <h1 style={{ color: '#064e3b' }}>🏗️ BauVision25</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setPage("dashboard")}>{nav[lang].dashboard}</button>
        <button onClick={() => setPage("upload")}>{nav[lang].upload}</button>
        <button onClick={() => setPage("account")}>{nav[lang].account}</button>
        <button onClick={() => setPage("lang")}>{nav[lang].lang}</button>
      </div>
      <div style={{ background: 'white', padding: 20, borderRadius: 12 }}>
        {page === "dashboard" && <Dashboard lang={lang} />}
        {page === "upload" && <Upload lang={lang} />}
        {page === "account" && <Account lang={lang} />}
        {page === "lang" && <LanguageSwitch lang={lang} setLang={setLang} />}
      </div>
    </div>
  );
}
