"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { encadrantApi } from "@/lib/api/index.js";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    numero: "",
    adresseCourrier: "",
    ecole: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const response = await encadrantApi.getEncadrantById(params.id);
        const encadrant = response.encadrant;
        console.log("Encadrant data:", encadrant); // Debug log
        
        if (!encadrant) {
          setError("Encadrant introuvable");
          return;
        }
        
        setForm({
          nom: encadrant.nom || "",
          prenom: encadrant.prenom || "",
          numero: encadrant.numero || "",
          adresseCourrier: encadrant.adresseCourrier || "",
          ecole: encadrant.ecole || "",
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
    if (!form.nom || !form.prenom || !form.numero || !form.ecole) {
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
        numero: form.numero,
        adresseCourrier: form.adresseCourrier,
        ecole: form.ecole,
      };

      await encadrantApi.updateEncadrant(params.id, updateData);
      setSuccess("Encadrant mis à jour avec succès!");
      
      // Redirect to encadrant list page after a short delay
      setTimeout(() => {
        router.push("/encadrant");
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'encadrant:", err);
      setError("Erreur lors de la mise à jour de l'encadrant");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet encadrant ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);
    try {
      await encadrantApi.deleteEncadrant(params.id);
      setSuccess("Encadrant supprimé avec succès!");
      setTimeout(() => {
        router.push("/encadrant");
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression de l'encadrant");
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
      <Link href="/encadrant">
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
          Retour
        </button>
      </Link>
      
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white w-fit px-10 py-8 rounded-lg shadow-lg mx-auto mt-10"
      >
        <legend className="text-blue-600 text-2xl font-bold mb-6">Modifier l'Encadrant #{params.id}</legend>
        
        {/* Nom */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Nom *</label>
          <input 
            type="text" 
            name="nom" 
            value={form.nom} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nom de l'encadrant"
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
            placeholder="Prénom de l'encadrant"
            required
          />
        </div>

        {/* Numéro */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Numéro *</label>
          <input 
            type="text" 
            name="numero" 
            value={form.numero} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Numéro de téléphone"
            required
          />
        </div>

        {/* Adresse Courrier */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Adresse Courrier</label>
          <textarea 
            name="adresseCourrier" 
            value={form.adresseCourrier} 
            onChange={handleChange} 
            rows="3"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Adresse courrier"
          />
        </div>

        {/* École */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">École *</label>
          <input 
            type="text" 
            name="ecole" 
            value={form.ecole} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="École de l'encadrant"
            required
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
