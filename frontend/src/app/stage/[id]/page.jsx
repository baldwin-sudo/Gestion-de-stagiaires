"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { stageApi } from "@/lib/api/index.js";

const Page = () => {
  const params = useParams();
  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        setLoading(true);
        const response = await stageApi.getStageById(params.id);
        setStage(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement du stage:", err);
        setError("Erreur lors du chargement du stage");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStage();
    }
  }, [params.id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_cours':
        return 'bg-blue-100 text-blue-800';
      case 'termine':
        return 'bg-green-100 text-green-800';
      case 'suspendu':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !stage) {
    return (
      <div className="w-full p-6 bg-gray-100 min-h-screen">
        <Link href="/stage">
          <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
            Retour
          </button>
        </Link>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error || "Stage introuvable"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <Link href="/stage">
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
          Retour
        </button>
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">Détails du Stage #{stage.ID}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stage Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Informations du Stage</h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Statut:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(stage.StatutStage)}`}>
                  {stage.StatutStage?.replace('_', ' ') || "-"}
                </span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Créé le:</span>
                <span className="ml-2 text-gray-600">{formatDate(stage.CreatedAt)}</span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Mis à jour le:</span>
                <span className="ml-2 text-gray-600">{formatDate(stage.UpdatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Stagiaire Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Stagiaire</h3>
            
            {stage.DemandeStage?.Stagiaire ? (
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Nom:</span>
                  <span className="ml-2 text-gray-600">
                    {stage.DemandeStage.Stagiaire.nom} {stage.DemandeStage.Stagiaire.prenom}
                  </span>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-600">{stage.DemandeStage.Stagiaire.email || "-"}</span>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">École:</span>
                  <span className="ml-2 text-gray-600">{stage.DemandeStage.Stagiaire.ecole || "-"}</span>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">Formation:</span>
                  <span className="ml-2 text-gray-600">{stage.DemandeStage.Stagiaire.formation || "-"}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Aucune information sur le stagiaire</p>
            )}
          </div>

          {/* Theme Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Thème du Stage</h3>
            
            {stage.DemandeStage?.Theme ? (
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Sujet:</span>
                  <p className="ml-2 text-gray-600 mt-1">{stage.DemandeStage.Theme.sujet || "Aucun sujet"}</p>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">Description:</span>
                  <p className="ml-2 text-gray-600 mt-1">{stage.DemandeStage.Theme.description || "Aucune description"}</p>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">Département:</span>
                  <span className="ml-2 text-gray-600">{stage.DemandeStage.Theme.departement || "-"}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Aucune information sur le thème</p>
            )}
          </div>

          {/* Team Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Équipe d'Encadrement</h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Encadrant:</span>
                <span className="ml-2 text-gray-600">
                  {stage.Encadrant?.nom || "-"} {stage.Encadrant?.prenom || ""}
                </span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Parrain:</span>
                <span className="ml-2 text-gray-600">
                  {stage.Parrain?.nom || "-"} {stage.Parrain?.prenom || ""}
                </span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Assistante:</span>
                <span className="ml-2 text-gray-600">
                  {stage.Assistante?.nom || "-"} {stage.Assistante?.prenom || ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            <Link href={`/stage/${stage.ID}/edit`}>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier le Stage
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page; 