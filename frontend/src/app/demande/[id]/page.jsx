"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { demandeApi ,stageApi,parrainApi,encadrantApi,assistanteApi} from "@/lib/api/index.js";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    validee: { color: "bg-green-100 text-green-800 border-green-200", label: "Validée" },
    en_attente: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "En attente" },
    rejetee: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejetée" }
  };
  
  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", label: status };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

const InfoCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      {title}
    </h3>
    {children}
  </div>
);

const Page = () => {
  const params = useParams();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showStageForm, setShowStageForm] = useState(false);
  const [stagiaireForm, setStagiaireForm] = useState({
    idEncadrant: "",
    idParrain: "",
    idAssistante: ""
  });
  
  const [encadrants, setEncadrants] = useState([]);
  const [parrains, setParrains] = useState([]);
  const [assistantes, setAssistantes] = useState([]);
  useEffect(() => {
    const fetchDemande = async () => {
      try {
        setLoading(true);
        const response = await demandeApi.getDemandeById(params.id);
        setDemande(response.demande);
      } catch (err) {
        console.error("Error fetching demande:", err);
        setError("Erreur lors du chargement de la demande");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDemande();
    }
  }, [params.id]);
  useEffect(() => {
    // Fetch dropdown options
    const fetchDropdowns = async () => {
      try {
        const [enc, par] = await Promise.all([
          encadrantApi.getAllEncadrants(),
          parrainApi.getAllParrains(),
       
        ]);
        setEncadrants(enc.encadrants);
        setParrains(par.parrains);
        setAssistantes([{id :1,nom:"test",prenom:"test"}]);
        console.log(enc,par);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    });

  const handleUpdateStatus = async (newStatus, motifRejet = "") => {
    try {
      setUpdating(true);
      const updateData = {
        statut_demande: newStatus,
        motif_rejet: motifRejet
      };
      
      await demandeApi.updateDemande(params.id, updateData);
      
      // Refresh the data
      const response = await demandeApi.getDemandeById(params.id);
      setDemande(response.demande);
      
      // Show success message
      const message = newStatus === 'validee' ? 'Demande validée avec succès!' : 'Demande rejetée avec succès!';
      // You could use a toast library here instead of alert
      alert(message);
    } catch (err) {
      console.error("Error updating demande:", err);
      alert("Erreur lors de la mise à jour de la demande");
    } finally {
      setUpdating(false);
    }
  };
  const handleValidateClick = () => {
    // Show the stage creation form
    setShowStageForm(true);
  };
  
  const handleStageFormChange = (e) => {
    setStagiaireForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleStageSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const payload = {
        statut_stage: "valider",
        id_encadrant: parseInt(stagiaireForm.idEncadrant, 10),
        id_parrain: parseInt(stagiaireForm.idParrain, 10),
        id_assistante: parseInt(stagiaireForm.idAssistante, 10),
        id_demande_stage: parseInt(demande.id, 10)
      };
      console.log(payload);
      await stageApi.createStage(payload);
      alert("Stage créé et demande validée avec succès!");
      setShowStageForm(false);
      // Refresh demande status
      const response = await demandeApi.getDemandeById(params.id);
      setDemande(response.demande);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du stage");
    } finally {
      setUpdating(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">Chargement de la demande...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !demande) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-8">
          <Link href="/demande">
            <button className="mb-6 inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux demandes
            </button>
          </Link>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">😕</div>
              <div className="text-xl text-gray-600 mb-2">{error || "Demande introuvable"}</div>
              <div className="text-gray-500">La demande que vous recherchez n'existe pas ou a été supprimée.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/demande">
            <button className="mb-4 inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux demandes
            </button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Demande de stage #{demande.id}
              </h1>
              <p className="text-gray-600">
                Créée le {formatDate(demande.created_at)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <StatusBadge status={demande.statut_demande} />
              <Link href={`/demande/${demande.id}/edit`}>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Demande Details */}
            <InfoCard title="📋 Détails de la demande">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Statut actuel</span>
                  <StatusBadge status={demande.statut_demande} />
                </div>
                
                {demande.statut_demande === "rejetee" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Motif du rejet</h4>
                        <p className="text-sm text-red-700 mt-1">{demande.motif_rejet || "Aucun motif spécifié"}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Dernière mise à jour</span>
                  <span className="text-gray-900">{formatDate(demande.updated_at)}</span>
                </div>
              </div>
            </InfoCard>

            {/* Theme Details */}
            <InfoCard title="🎯 Thème de stage">
              {demande.Theme ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{demande.Theme.sujet}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {demande.Theme.description || "Aucune description disponible"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {demande.Theme.departement && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Département</span>
                        <p className="text-sm text-gray-900 mt-1">{demande.Theme.departement}</p>
                      </div>
                    )}
                    {demande.Theme.type && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
                        <p className="text-sm text-gray-900 mt-1">{demande.Theme.type.toUpperCase()}</p>
                      </div>
                    )}
                  </div>
                  
                  {demande.Theme.prerequisites && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prérequis</span>
                      <p className="text-sm text-gray-900 mt-1">{demande.Theme.prerequisites}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-500">Aucune information sur le thème</p>
                </div>
              )}
            </InfoCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stagiaire Details */}
            <InfoCard title="👤 Informations du stagiaire">
              {demande.Stagiaire ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {demande.Stagiaire.nom?.[0]}{demande.Stagiaire.prenom?.[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {demande.Stagiaire.nom} {demande.Stagiaire.prenom}
                      </h4>
                      <p className="text-gray-600">Stagiaire</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-gray-600">École</span>
                      <span className="ml-auto text-gray-900">{demande.Stagiaire.ecole || "Non spécifiée"}</span>
                    </div>
                    
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-gray-600">Spécialité</span>
                      <span className="ml-auto text-gray-900">{demande.Stagiaire.specialite || "Non spécifiée"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">👤</div>
                  <p className="text-gray-500">Aucune information sur le stagiaire</p>
                </div>
              )}
            </InfoCard>

            {/* Actions */}
            {demande.statut_demande === "en_attente" && (
              <InfoCard title="⚡ Actions" className="border-2 border-dashed border-blue-200 bg-blue-50">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Cette demande est en attente de validation. Vous pouvez l'approuver ou la rejeter.
                  </p>
                  
                  <div className="flex space-x-3">
                  {!showStageForm ? (
  <button
    onClick={handleValidateClick}
    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
  >
    Valider la demande et créer le stage
  </button>
) : (
  <form onSubmit={handleStageSubmit} className="flex-1 flex flex-col space-y-3">
    <select
      name="idEncadrant"
      value={stagiaireForm.idEncadrant}
      onChange={handleStageFormChange}
      required
      className="border rounded p-2 w-full"
    >
      <option value="">Sélectionner un encadrant</option>
      {encadrants.map(enc => (
        <option key={enc.id} value={enc.id}>{enc.nom} {enc.prenom}</option>
      ))}
    </select>

    <select
      name="idParrain"
      value={stagiaireForm.idParrain}
      onChange={handleStageFormChange}
      required
      className="border rounded p-2 w-full"
    >
      <option value="">Sélectionner un parrain</option>
      {parrains.map(par => (
        <option key={par.id} value={par.id}>{par.nom} {par.prenom}</option>
      ))}
    </select>

    <select
      name="idAssistante"
      value={stagiaireForm.idAssistante}
      onChange={handleStageFormChange}
      required
      className="border rounded p-2 w-full"
    >
      <option value="">Sélectionner une assistante</option>
      {assistantes.map(ass => (
  <option key={ass.id} value={ass.id}>{ass.nom} {ass.prenom}</option>
      ))}
    </select>

    <button
      type="submit"
      disabled={updating}
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {updating ? "Création..." : "Créer Stage"}
    </button>
  </form>
)}
                    
                    <button 
                      onClick={() => {
                        const motif = prompt("Motif du rejet:");
                        if (motif !== null) {
                          handleUpdateStatus("rejetee", motif);
                        }
                      }}
                      disabled={updating}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {updating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      Rejeter
                    </button>
                  </div>
                </div>
              </InfoCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
