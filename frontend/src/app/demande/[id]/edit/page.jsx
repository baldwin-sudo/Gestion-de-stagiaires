"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { demandeApi, themeApi, stagiaireApi } from "@/lib/api/index.js";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    statut_demande: "en_attente",
    motif_rejet: "",
    id_theme: "",
    id_stagiaire: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [options, setOptions] = useState({ 
    themes: [], 
    stagiaires: [] 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        const [demandeResponse, themesResponse, stagiairesResponse] = await Promise.all([
          demandeApi.getDemandeById(params.id),
          themeApi.getAllThemes(),
          stagiaireApi.getAllStagiaires()
        ]);

        const demande = demandeResponse.demande;
        console.log("Demande data:", demande); // Debug log
        
        if (!demande) {
          setError("Demande introuvable");
          return;
        }
        
        setForm({
          statut_demande: demande.statut_demande || "en_attente",
          motif_rejet: demande.motif_rejet === "_" ? "" : (demande.motif_rejet || ""),
          id_theme: demande.id_theme?.toString() || "",
          id_stagiaire: demande.id_stagiaire?.toString() || "",
        });

        setOptions({
          themes: themesResponse.data || [],
          stagiaires: stagiairesResponse.data || []
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
    if (!form.id_theme || !form.id_stagiaire) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const updateData = {
        statut_demande: form.statut_demande,
        motif_rejet: form.statut_demande === "rejetee" ? form.motif_rejet : "_",
        id_theme: parseInt(form.id_theme),
        id_stagiaire: parseInt(form.id_stagiaire),
      };

      await demandeApi.updateDemande(params.id, updateData);
      setSuccess("Demande mise à jour avec succès!");
      
      // Redirect to demande detail page after a short delay
      setTimeout(() => {
        router.push(`/demande/${params.id}`);
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la demande:", err);
      setError("Erreur lors de la mise à jour de la demande");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);
    try {
      await demandeApi.deleteDemande(params.id);
      setSuccess("Demande supprimée avec succès!");
      setTimeout(() => {
        router.push("/demande");
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression de la demande");
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
      <Link href={`/demande/${params.id}`}>
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
          Retour
        </button>
      </Link>
      
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white w-fit px-10 py-8 rounded-lg shadow-lg mx-auto mt-10"
      >
        <legend className="text-blue-600 text-2xl font-bold mb-6">Modifier la Demande #{params.id}</legend>
        
        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Statut de la demande *</label>
          <select 
            name="statut_demande" 
            value={form.statut_demande} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en_attente">En attente</option>
            <option value="validee">Validée</option>
            <option value="rejetee">Rejetée</option>
          </select>
        </div>

        {/* Motif de rejet (only show if status is rejected) */}
        {form.statut_demande === "rejetee" && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Motif du rejet</label>
            <textarea 
              name="motif_rejet" 
              value={form.motif_rejet} 
              onChange={handleChange} 
              rows="3"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Expliquez pourquoi la demande a été rejetée..."
            />
          </div>
        )}

        {/* Theme */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Thème de stage *</label>
          <select 
            name="id_theme" 
            value={form.id_theme} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Sélectionner un thème --</option>
            {options.themes?.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.sujet} - {theme.departement}
              </option>
            ))}
          </select>
        </div>

        {/* Stagiaire */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Stagiaire *</label>
          <select 
            name="id_stagiaire" 
            value={form.id_stagiaire} 
            onChange={handleChange} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Sélectionner un stagiaire --</option>
            {options.stagiaires?.map((stagiaire) => (
              <option key={stagiaire.id} value={stagiaire.id}>
                {stagiaire.nom} {stagiaire.prenom} - {stagiaire.ecole || "École non spécifiée"}
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
