
import React, { useState } from "react";

export default function Account({ lang }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: ""
  });

  return (
    <div>
      <h2>{lang === "de" ? "👤 Benutzerkonto" : "👤 User Account"}</h2>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><br />
      <input placeholder="E-Mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><br />
      <input placeholder={lang === "de" ? "Telefonnummer" : "Phone Number"} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /><br />
      <input placeholder={lang === "de" ? "Adresse" : "Address"} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
    </div>
  );
}
