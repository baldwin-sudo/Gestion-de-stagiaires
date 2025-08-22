"use client";
import { useState } from "react";
import Link from "next/link";
const CreateThemeForm = () => {
  const [formData, setFormData] = useState({
    sujet: "",
    departement: "",
    type: "",
    date_debut: "",
    date_fin: "",
    description: "",
    prerequisites: "",
    duree: "",
    id_encadrant: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }

      const res = await fetch("http://localhost:8080/theme_stage/", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      setStatus("success");
      setFormData({
        sujet: "",
        departement: "",
        type: "",
        date_debut: "",
        date_fin: "",
        description: "",
        prerequisites: "",
        duree: "",
        id_encadrant: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="flex  justify-center w-full">
      <Link href="/offre">
        <button className="bg-blue-700 px-2 py-1  font-semibold text-white transition-all duration-200 hover:opacity-70 hover:scale-105 rounded-lg ml-15 mt-15">
          retour
        </button>
      </Link>
      <div className="max-w-4xl mx-auto bg-white p-8 mt-10 rounded shadow-md h-fit">
        <h2 className="text-3xl font-bold mb-6 text-blue-900">
          Créer un thème de stage
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            name="sujet"
            type="text"
            placeholder="Sujet"
            value={formData.sujet}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            name="departement"
            type="text"
            placeholder="Département"
            value={formData.departement}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            name="type"
            type="text"
            placeholder="Type (ex: PFE, PLE)"
            value={formData.type}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            name="duree"
            type="number"
            placeholder="Durée (en jours)"
            value={formData.duree}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <div className="flex flex-col ">
            <label
              className="text-gray-700 capitalize px-1 pb-1"
              htmlFor="date_debut"
            >
              date debut
            </label>
            <input
              name="date_debut"
              type="date"
              value={formData.date_debut}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-gray-700 capitalize px-1 pb-1"
              htmlFor="date_fin"
            >
              date fin
            </label>
            <input
              name="date_fin"
              type="date"
              value={formData.date_fin}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>
          <input
            name="id_encadrant"
            type="text"
            placeholder="ID Encadrant"
            value={formData.id_encadrant}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 md:col-span-2 h-24"
          />
          <textarea
            name="prerequisites"
            placeholder="Prérequis"
            value={formData.prerequisites}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 md:col-span-2 h-20"
          />

          <div className="md:col-span-2 flex justify-end gap-4 items-center">
            {status === "success" && (
              <p className="text-green-600 font-medium">
                ✅ Thème créé avec succès !
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-medium">
                ❌ Une erreur est survenue.
              </p>
            )}
            <button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateThemeForm;
