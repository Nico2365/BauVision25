
import React, { useState } from "react";

export default function ProjectOverview({ projects, onSelect, onAdd, user }) {
  const [newProject, setNewProject] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "#065f46" }}>🏗️ BauVision25 – Projektübersicht</h1>
      <p>Angemeldet als: {user.email}</p>
      <input
        placeholder="Neue Baustelle anlegen"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAdd(newProject);
            setNewProject("");
          }
        }}
      />
      <div style={{ marginTop: 20 }}>
        {projects.map((name, i) => (
          <div key={i} style={{ padding: 10, border: "1px solid #ccc", marginBottom: 8 }}>
            <strong>{name}</strong><br />
            <button onClick={() => onSelect(name)}>🧱 Öffnen</button>
          </div>
        ))}
      </div>
    </div>
  );
}
