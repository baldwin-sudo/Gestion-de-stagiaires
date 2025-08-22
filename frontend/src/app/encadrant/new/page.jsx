"use client";
import { useState } from "react";
import Link from "next/link";

const Page = () => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    numero: "",
    adresseCourrier: "",
    ecole: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("prenom", form.prenom);
      formData.append("numero", form.numero);
      formData.append("adresseCourrier", form.adresseCourrier);
      formData.append("ecole", form.ecole);
      const res = await fetch("http://localhost:8080/encadrant/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // important
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error("Erreur lors de la création");
      setStatus("success");
      setForm({ nom: "", prenom: "", numero: "", adresseCourrier: "", ecole: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <Link href="/encadrant">
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
          Retour
        </button>
      </Link>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white w-fit px-10 py-5 rounded-lg shadow-lg mx-auto mt-10"
      >
        <legend className="text-blue-600 text-xl mb-4">Nouvel Encadrant</legend>
        <div className="flex flex-col gap-2">
          <label>Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} required className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col gap-2">
          <label>Prénom</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} required className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col gap-2">
          <label>Numéro</label>
          <input name="numero" value={form.numero} onChange={handleChange} required className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col gap-2">
          <label>Adresse Courrier</label>
          <input name="adresseCourrier" value={form.adresseCourrier} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col gap-2">
          <label>École</label>
          <input name="ecole" value={form.ecole} onChange={handleChange} required className="border rounded px-3 py-2" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
        >
          Créer
        </button>
        {status === "success" && <p className="text-green-600">Encadrant créé !</p>}
        {status === "error" && <p className="text-red-600">Erreur lors de la création.</p>}
      </form>
    </div>
  );
};

export default Page; 