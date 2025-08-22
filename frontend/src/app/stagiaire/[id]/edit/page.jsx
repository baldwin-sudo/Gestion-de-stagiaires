"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { stagiaireApi } from "@/lib/api/index.js";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    ecole: "",
    specialite: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const response = await stagiaireApi.getStagiaireById(params.id);
        const stagiaire = response.data;
        console.log("Stagiaire data:", stagiaire); // Debug log
        
        if (!stagiaire) {
          setError("Stagiaire introuvable");
          return;
        }
        
        setForm({
          nom: stagiaire.nom || "",
          prenom: stagiaire.prenom || "",
          ecole: stagiaire.ecole || "",
          specialite: stagiaire.specialite || "",
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
    if (!form.nom || !form.prenom) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const updateData = {
        nom: form.nom,
        prenom: form.prenom,
        ecole: form.ecole,
        specialite: form.specialite,
      };

      await stagiaireApi.updateStagiaire(params.id, updateData);
      setSuccess("Stagiaire mis à jour avec succès!");
      
      // Redirect to stagiaire detail page after a short delay
      setTimeout(() => {
        router.push(`/stagiaire/${params.id}`);
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du stagiaire:", err);
      setError("Erreur lors de la mise à jour du stagiaire");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);
    try {
      await stagiaireApi.deleteStagiaire(params.id);
      setSuccess("Stagiaire supprimé avec succès!");
      setTimeout(() => {
        router.push("/stagiaire");
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression du stagiaire");
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
      <Link href={`/stagiaire/${params.id}`}>
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
          Retour
        </button>
      </Link>
      
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white w-fit px-10 py-8 rounded-lg shadow-lg mx-auto mt-10"
      >
        <legend className="text-blue-600 text-2xl font-bold mb-6">Modifier le Stagiaire #{params.id}</legend>
        
        {/* Nom */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Nom *</label>
          <input 
            type="text" 
            name="nom" 
            value={form.nom} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nom du stagiaire"
            required
          />
        </div>

        {/* Prénom */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Prénom *</label>
          <input 
            type="text" 
            name="prenom" 
            value={form.prenom} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Prénom du stagiaire"
            required
          />
        </div>

        {/* École */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">École</label>
          <input 
            type="text" 
            name="ecole" 
            value={form.ecole} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="École du stagiaire"
          />
        </div>

        {/* Spécialité */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Spécialité</label>
          <input 
            type="text" 
            name="specialite" 
            value={form.specialite} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Spécialité du stagiaire"
          />
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
