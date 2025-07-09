
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [activeProject, setActiveProject] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, "projects"), where("uid", "==", currentUser.uid));
        onSnapshot(q, (snapshot) => {
          const list = [];
          snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
          setProjects(list);
        });
      } else {
        setUser(null);
        setProjects([]);
      }
    });
  }, []);

  const login = () => {
    signInWithEmailAndPassword(auth, email, password).catch((err) =>
      setError(err.message)
    );
  };

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password).catch((err) =>
      setError(err.message)
    );
  };

  const logout = () => signOut(auth);

  const addProject = async () => {
    if (!projectName.trim()) return;
    const q = query(
      collection(db, "projects"),
      where("uid", "==", user.uid),
      where("name", "==", projectName.trim())
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      setError("❌ Projektname existiert bereits.");
      return;
    }
    await addDoc(collection(db, "projects"), {
      uid: user.uid,
      name: projectName.trim(),
      images: [],
    });
    setProjectName("");
    setError("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeProject) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const updatedImages = [...(activeProject.images || []), base64];

      await updateDoc(doc(db, "projects", activeProject.id), {
        images: updatedImages,
      });

      setActiveProject({ ...activeProject, images: updatedImages });
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", background: "#f0fdf4", padding: 20, borderRadius: 12 }}>
        <h2>BauVision25 Login</h2>
        <input placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Passwort" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Einloggen</button>
        <button onClick={register}>Registrieren</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  if (activeProject) {
    return (
      <div style={{ maxWidth: 800, margin: "30px auto", background: "#ecfdf5", padding: 20, borderRadius: 12 }}>
        <h2>📁 Projekt: {activeProject.name}</h2>
        <button onClick={() => setActiveProject(null)}>⬅️ Zurück zur Übersicht</button>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <p>{activeProject.images?.length || 0} Bild(er) gespeichert</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
          {(activeProject.images || []).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Bild ${i + 1}`}
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", background: "#ecfdf5", padding: 20, borderRadius: 12 }}>
      <h1>🛠️ BauVision25</h1>
      <p>👤 Angemeldet als: {user.email}</p>
      <button onClick={logout}>🚪 Abmelden</button>
      <hr />
      <input
        placeholder="Neues Projekt"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <button onClick={addProject}>Projekt hinzufügen</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>📋 Deine Projekte</h3>
      {projects.map((p) => (
        <div key={p.id} style={{ margin: "10px 0", padding: 10, background: "#d1fae5", borderRadius: 6 }}>
          <span>{p.name}</span>
          <button style={{ marginLeft: 10 }} onClick={() => setActiveProject(p)}>Öffnen</button>
        </div>
      ))}
    </div>
  );
}
