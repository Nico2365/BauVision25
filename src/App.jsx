
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadProjects(u.uid);
    });
  }, []);

  const register = () => {
    createUserWithEmailAndPassword(auth, loginForm.email, loginForm.password).catch(alert);
  };

  const login = () => {
    signInWithEmailAndPassword(auth, loginForm.email, loginForm.password).catch(alert);
  };

  const loadProjects = async (uid) => {
    const q = query(collection(db, "projects"), where("uid", "==", uid));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(data);
  };

  const addProject = async () => {
    if (!newProject) return;
    await addDoc(collection(db, "projects"), {
      uid: user.uid,
      name: newProject,
      created: Date.now()
    });
    setNewProject("");
    loadProjects(user.uid);
  };

  if (!user) {
    return (
      <div style={{ padding: 30 }}>
        <h2>BauVision25 Login</h2>
        <input placeholder="E-Mail" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} /><br />
        <input type="password" placeholder="Passwort" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} /><br />
        <button onClick={login}>Einloggen</button>
        <button onClick={register}>Registrieren</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Willkommen, {user.email}</h2>
      <input placeholder="Neues Projekt" value={newProject} onChange={e => setNewProject(e.target.value)} />
      <button onClick={addProject}>Hinzufügen</button>
      <ul>
        {projects.map((p, i) => <li key={i}>{p.name}</li>)}
      </ul>
    </div>
  );
}
