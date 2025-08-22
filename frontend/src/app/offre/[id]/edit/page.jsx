"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { offreApi, encadrantApi } from "@/lib/api/index.js";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [options, setOptions] = useState({ 
    encadrants: []
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const [offreResponse, encadrantsResponse] = await Promise.all([
          offreApi.getOffreById(params.id),
          encadrantApi.getAllEncadrants()
        ]);

        const offre = offreResponse.data;
        console.log("Offre data:", offre); // Debug log
        
        if (!offre) {
          setError("Offre introuvable");
          return;
        }
        
        setForm({
          sujet: offre.sujet || "",
          departement: offre.departement || "",
          type: offre.type || "",
          date_debut: offre.date_debut ? new Date(offre.date_debut).toISOString().split('T')[0] : "",
          date_fin: offre.date_fin ? new Date(offre.date_fin).toISOString().split('T')[0] : "",
          description: offre.description || "",
          prerequisites: offre.prerequisites || "",
          duree: offre.duree?.toString() || "",
          id_encadrant: offre.id_encadrant?.toString() || "",
        });

        setOptions({
          encadrants: encadrantsResponse.encadrants || []
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
      } finally {
        setInitialLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.sujet || !form.departement || !form.type || !form.date_debut || !form.date_fin || !form.description || !form.prerequisites || !form.duree || !form.id_encadrant) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const updateData = {
        sujet: form.sujet,
        departement: form.departement,
        type: form.type,
        date_debut: form.date_debut,
        date_fin: form.date_fin,
        description: form.description,
        prerequisites: form.prerequisites,
        duree: parseInt(form.duree),
        id_encadrant: parseInt(form.id_encadrant),
      };

      await offreApi.updateOffre(params.id, updateData);
      setSuccess("Offre mise à jour avec succès!");
      
      // Redirect to offre list page after a short delay
      setTimeout(() => {
        router.push("/offre/all");
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'offre:", err);
      setError("Erreur lors de la mise à jour de l'offre");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);
    try {
      await offreApi.deleteOffre(params.id);
      setSuccess("Offre supprimée avec succès!");
      setTimeout(() => {
        router.push("/offre/all");
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression de l'offre");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full p-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-lg text-gray-600">Chargement...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <Link href="/offre/all">
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
          Retour
        </button>
      </Link>
      
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white w-fit px-10 py-8 rounded-lg shadow-lg mx-auto mt-10"
      >
        <legend className="text-blue-600 text-2xl font-bold mb-6">Modifier l'Offre #{params.id}</legend>
        
        {/* Sujet */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Sujet *</label>
          <input 
            type="text" 
            name="sujet" 
            value={form.sujet} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Sujet du stage"
            required
          />
        </div>

        {/* Département */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Département *</label>
          <input 
            type="text" 
            name="departement" 
            value={form.departement} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Département"
            required
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Type *</label>
          <select 
            name="type" 
            value={form.type} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Sélectionner un type --</option>
            <option value="pfe">PFE</option>
            <option value="pfa">PFA</option>
            <option value="stage">Stage</option>
          </select>
        </div>

        {/* Date de début */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Date de début *</label>
          <input 
            type="date" 
            name="date_debut" 
            value={form.date_debut} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Date de fin */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Date de fin *</label>
          <input 
            type="date" 
            name="date_fin" 
            value={form.date_fin} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Description *</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            rows="4"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description détaillée du stage"
            required
          />
        </div>

        {/* Prérequis */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Prérequis *</label>
          <textarea 
            name="prerequisites" 
            value={form.prerequisites} 
            onChange={handleChange} 
            rows="3"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Compétences et prérequis nécessaires"
            required
          />
        </div>

        {/* Durée */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Durée (en jours) *</label>
          <input 
            type="number" 
            name="duree" 
            value={form.duree} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Durée en jours"
            min="1"
            required
          />
        </div>

        {/* Encadrant */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Encadrant *</label>
          <select 
            name="id_encadrant" 
            value={form.id_encadrant} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Sélectionner un encadrant --</option>
            {options.encadrants?.map((encadrant) => (
              <option key={encadrant.id} value={encadrant.id}>
                {encadrant.nom} {encadrant.prenom} - {encadrant.departement || "Département non spécifié"}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
