"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { stageApi } from "@/lib/api/index.js";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    statut_stage: "en_cours",
    id_encadrant: "",
    id_parrain: "",
    id_assistante: "",
    id_demande_stage: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [options, setOptions] = useState({ 
    encadrants: [], 
    parrains: [], 
    assistantes: [], 
    demandes: [] 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const [stageResponse, optionsResponse] = await Promise.all([
          stageApi.getStageById(params.id),
          stageApi.getStageOptions()
        ]);

        const stage = stageResponse.data;
        console.log("Stage data:", stage); // Debug log
        
        if (!stage) {
          setError("Stage introuvable");
          return;
        }
        
        setForm({
          statut_stage: stage.statut_stage || "en_cours",
          id_encadrant: stage.id_encadrant?.toString() || "",
          id_parrain: stage.id_parrain?.toString() || "",
          id_assistante: stage.id_assistante?.toString() || "",
          id_demande_stage: stage.id_demande_stage?.toString() || "",
        });

        setOptions({
          encadrants: optionsResponse.encadrants || [],
          parrains: optionsResponse.parrains || [],
          assistantes: optionsResponse.assistantes || [],
          demandes: optionsResponse.demandes || []
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
    if (!form.id_encadrant || !form.id_parrain || !form.id_assistante || !form.id_demande_stage) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const updateData = {
        statut_stage: form.statut_stage,
        id_encadrant: parseInt(form.id_encadrant),
        id_parrain: parseInt(form.id_parrain),
        id_assistante: parseInt(form.id_assistante),
        id_demande_stage: parseInt(form.id_demande_stage),
      };

      await stageApi.updateStage(params.id, updateData);
      setSuccess("Stage mis à jour avec succès!");
      
      // Redirect to stage detail page after a short delay
      setTimeout(() => {
        router.push(`/stage/${params.id}`);
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du stage:", err);
      setError("Erreur lors de la mise à jour du stage");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce stage ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);
    try {
      await stageApi.deleteStage(params.id);
      setSuccess("Stage supprimé avec succès!");
      setTimeout(() => {
        router.push("/stage");
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression du stage");
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
      <Link href={`/stage/${params.id}`}>
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
          Retour
        </button>
      </Link>
      
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white w-fit px-10 py-8 rounded-lg shadow-lg mx-auto mt-10"
      >
        <legend className="text-blue-600 text-2xl font-bold mb-6">Modifier le Stage #{params.id}</legend>
        
        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Statut du stage *</label>
          <select 
            name="statut_stage" 
            value={form.statut_stage} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>

        {/* Encadrant */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Encadrant *</label>
          <select 
            name="id_encadrant" 
            value={form.id_encadrant} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            
          >
            <option value="">-- Sélectionner un encadrant --</option>
            {options.encadrants?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom} {e.prenom} - {e.ecole || "École non spécifiée"}
              </option>
            ))}
          </select>
        </div>

        {/* Parrain */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Parrain *</label>
          <select 
            name="id_parrain" 
            value={form.id_parrain} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            
          >
            <option value="">-- Sélectionner un parrain --</option>
            {options.parrains?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} {p.prenom} - {p.departement || "Département non spécifié"}
              </option>
            ))}
          </select>
        </div>

        {/* Assistante */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Assistante *</label>
          <select 
            name="id_assistante" 
            value={form.id_assistante} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            
          >
            <option value="">-- Sélectionner une assistante --</option>
            {options.assistantes?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom} {a.prenom}
              </option>
            ))}
          </select>
        </div>

        {/* Demande de Stage */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Demande de Stage *</label>
          <select 
            name="id_demande_stage" 
            value={form.id_demande_stage} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            
          >
            <option value="">-- Sélectionner une demande --</option>
            {options.demandes?.map((d) => (
              <option key={d.id} value={d.id}>
                #{d.id} - {d.Stagiaire?.nom} {d.Stagiaire?.prenom} ({d.Theme?.sujet || "Thème non spécifié"})
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
