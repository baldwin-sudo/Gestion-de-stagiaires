"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { stageApi } from "@/lib/api/index.js";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    en_cours: { color: "bg-blue-100 text-blue-800", label: "En cours" },
    termine: { color: "bg-green-100 text-green-800", label: "Terminé" },
    annule: { color: "bg-red-100 text-red-800", label: "Annulé" }
  };
  
  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const StageCard = ({ stage, onDelete }) => {
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer ce stage ?")) {
      onDelete(stage.ID);
    }
  };

  return (
    <Link href={`/stage/${stage.ID}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Stage #{stage.ID}
            </h3>
            <p className="text-sm text-gray-500">
              {stage.date_validation && new Date(stage.date_validation).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={stage.statut_stage} />
            <Link href={`/stage/${stage.ID}/edit`}>
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      
      <div className="space-y-3">
        {/* Stagiaire Info */}
        {stage.DemandeStage?.Stagiaire && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">
                {stage.DemandeStage.Stagiaire.nom?.[0]}{stage.DemandeStage.Stagiaire.prenom?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {stage.DemandeStage.Stagiaire.nom} {stage.DemandeStage.Stagiaire.prenom}
              </p>
              <p className="text-sm text-gray-500">
                {stage.DemandeStage.Stagiaire.ecole || "École non spécifiée"}
              </p>
            </div>
          </div>
        )}
        
        {/* Theme Info */}
        {stage.DemandeStage?.Theme && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Thème:</span> {stage.DemandeStage.Theme.sujet}
            </p>
            <p className="text-sm text-gray-500">
              {stage.DemandeStage.Theme.departement || "Département non spécifié"}
            </p>
          </div>
        )}
        
        {/* Team Info */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">Encadrant:</span>
              <span className="ml-1 font-medium text-gray-900">
                {stage.Encadrant?.nom || "Non assigné"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Parrain:</span>
              <span className="ml-1 font-medium text-gray-900">
                {stage.Parrain?.nom || "Non assigné"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
);}

const Page = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        setLoading(true);
        const response = await stageApi.getAllStages();
        setStages(response.data || []);
      } catch (err) {
        console.error("Error fetching stages:", err);
        setError("Erreur lors du chargement des stages");
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, []);

  const handleDelete = async (stageId) => {
    try {
      await stageApi.deleteStage(stageId);
      setStages(stages.filter(stage => stage.ID !== stageId));
      alert("Stage supprimé avec succès!");
    } catch (err) {
      console.error("Error deleting stage:", err);
      alert("Erreur lors de la suppression du stage");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">Chargement des stages...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">😕</div>
              <div className="text-xl text-gray-600 mb-2">{error}</div>
              <div className="text-gray-500">Impossible de charger les stages pour le moment.</div>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des stages</h1>
              <p className="text-gray-600">Suivez et gérez tous les stages en cours</p>
            </div>
            <Link href="/stage/new">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau stage
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total stages</p>
                  <p className="text-2xl font-bold text-gray-900">{stages.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stages.filter(s => s.statut_stage === 'en_cours').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stages.filter(s => s.statut_stage === 'termine').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stages List */}
        <div className="space-y-6">
          {stages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun stage</h3>
              <p className="text-gray-500 mb-6">
                Aucun stage n'a été créé pour le moment.
              </p>
              <Link href="/stage/new">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Créer le premier stage
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stages.map((stage) => (
                <StageCard key={stage.ID} stage={stage} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page; 