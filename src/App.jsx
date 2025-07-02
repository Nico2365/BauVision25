
import React, { useState } from "react";
import ProjectOverview from "./ProjectOverview.jsx";
import ProjectDetail from "./ProjectDetail.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      setUser({ email: loginForm.email });
    }
  };

  const addProject = (name) => {
    if (!name || projects[name]) return;
    setProjects({ ...projects, [name]: [] });
  };

  const addImageToProject = (projectName, imageURL) => {
    setProjects({
      ...projects,
      [projectName]: [...projects[projectName], imageURL],
    });
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#d1fae5", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ background: "white", padding: 24, borderRadius: 12 }}>
          <h2>BauVision25 Login</h2>
          <input placeholder="E-Mail" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} /><br />
          <input type="password" placeholder="Passwort" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} /><br />
          <button onClick={handleLogin}>Einloggen</button>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <ProjectDetail
        name={selectedProject}
        images={projects[selectedProject]}
        onBack={() => setSelectedProject(null)}
        onAddImage={(url) => addImageToProject(selectedProject, url)}
      />
    );
  }

  return (
    <ProjectOverview
      projects={Object.keys(projects)}
      onSelect={setSelectedProject}
      onAdd={addProject}
      user={user}
    />
  );
}
