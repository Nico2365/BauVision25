
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, doc, setDoc, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [activeProject, setActiveProject] = useState(null);
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        setUser(usr);
        const q = query(collection(db, "projects"), where("uid", "==", usr.uid));
        onSnapshot(q, (snapshot) => {
          const arr = [];
          snapshot.forEach((doc) => arr.push({ id: doc.id, ...doc.data() }));
          setProjects(arr);
        });
      } else {
        setUser(null);
        setProjects([]);
      }
    });
  }, []);

  const register = () => {
    createUserWithEmailAndPassword(auth, email, pw).catch((err) => setError(err.message));
  };

  const login = () => {
    signInWithEmailAndPassword(auth, email, pw).catch((err) => setError(err.message));
  };

  const logout = () => signOut(auth);

  const addProject = async () => {
    if (!projectName) return;
    const q = query(collection(db, "projects"), where("uid", "==", user.uid), where("name", "==", projectName));
    const existing = await getDocs(q);
    if (!existing.empty) {
      setError("❌ Projektname existiert bereits.");
      return;
    }
    await addDoc(collection(db, "projects"), {
      uid: user.uid,
      name: projectName,
      images: [],
    });
    setProjectName("");
    setError("");
  };

  const openProject = (p) => {
    setActiveProject(p);
    setMessages([]);
    setImage(null);
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const updated = [...(activeProject.images || []), base64];
      await setDoc(doc(db, "projects", activeProject.id), {
        ...activeProject,
        images: updated,
      });
      setActiveProject({ ...activeProject, images: updated });
    };
    reader.readAsDataURL(file);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Projektbericht – BauVision25", 20, 20);
    doc.setFontSize(12);
    doc.text(`Projektname: ${activeProject?.name}`, 20, 35);
    doc.text("Bildanzahl: " + (activeProject?.images?.length || 0), 20, 45);
    doc.text("Hinweise:", 20, 60);
    doc.text(messages.join("\n") || "Noch keine Analyse durchgeführt.", 20, 70);
    doc.save("bauvision-projekt.pdf");
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: "50px auto", background: "#f0fdf4", padding: 20, borderRadius: 12 }}>
        <h2>BauVision25 Login</h2>
        <input placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Passwort" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
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
        <button onClick={() => setActiveProject(null)}>⬅️ Zurück</button>
        <input type="file" accept="image/*" onChange={uploadImage} />
        <p>{activeProject.images?.length || 0} Bild(er) gespeichert</p>
        <button onClick={exportPDF}>PDF exportieren</button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
          {activeProject.images?.map((img, idx) => (
            <img key={idx} src={img} alt="Upload" style={{ width: 100, height: 100, objectFit: "cover" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", background: "#ecfdf5", padding: 20, borderRadius: 12 }}>
      <h1>🛠️ BauVision25</h1>
      <p>👤 {user.email}</p>
      <button onClick={logout}>Abmelden</button>
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
          <button style={{ marginLeft: 10 }} onClick={() => openProject(p)}>Öffnen</button>
        </div>
      ))}
    </div>
  );
}
