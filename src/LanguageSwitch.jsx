
import React from "react";

export default function LanguageSwitch({ lang, setLang }) {
  return (
    <div>
      <h2>🌍 Sprache / Language</h2>
      <button onClick={() => setLang("de")}>🇩🇪 Deutsch</button>
      <button onClick={() => setLang("en")}>🇬🇧 English</button>
      <p>Aktuell: {lang === "de" ? "Deutsch" : "English"}</p>
    </div>
  );
}
