"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { stagiaireApi } from "@/lib/api/index.js";

const StagiaireCard = ({ stagiaire, onDelete }) => {
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      onDelete(stagiaire.id);
    }
  };

  return (
    <Link href={`/stagiaire/${stagiaire.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer relative">
        <div className="flex flex-col gap-5 items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 text-lg font-semibold">
              {stagiaire.nom?.[0]}{stagiaire.prenom?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {stagiaire.nom} {stagiaire.prenom}
            </h3>
            <p className="text-gray-600">{stagiaire.ecole || "École non spécifiée"}</p>
            <p className="text-sm text-gray-500">{stagiaire.specialite || "Spécialité non spécifiée"}</p>
         
          </div>
          <div className="flex items-center space-x-2">
          
            <Link href={`/stagiaire/${stagiaire.id}/edit`}>
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
      
      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">Demandes:</span>
              <span className="font-medium text-gray-900">{stagiaire.demandes?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">Présences:</span>
              <span className="font-medium text-gray-900">{stagiaire.presences?.length || 0}</span>
            </div>
          </div>
          <div className="text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Link>
);}

const Page = () => {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStagiaires = async () => {
      try {
        setLoading(true);
        const response = await stagiaireApi.getAllStagiaires();
        setStagiaires(response.data || []);
      } catch (err) {
        console.error("Error fetching stagiaires:", err);
        setError("Erreur lors du chargement des stagiaires");
      } finally {
        setLoading(false);
      }
    };
    fetchStagiaires();
  }, []);

  const handleDelete = async (stagiaireId) => {
    try {
      await stagiaireApi.deleteStagiaire(stagiaireId);
      setStagiaires(stagiaires.filter(stagiaire => stagiaire.id !== stagiaireId));
      alert("Stagiaire supprimé avec succès!");
    } catch (err) {
      console.error("Error deleting stagiaire:", err);
      alert("Erreur lors de la suppression du stagiaire");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">Chargement des stagiaires...</div>
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
              <div className="text-gray-500">Impossible de charger les stagiaires pour le moment.</div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des stagiaires</h1>
              <p className="text-gray-600">Gérez les stagiaires et suivez leur progression</p>
            </div>
            <Link href="/stagiaire/new">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau stagiaire
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total stagiaires</p>
                  <p className="text-2xl font-bold text-gray-900">{stagiaires.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stagiaires.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Écoles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(stagiaires.map(s => s.ecole).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Spécialités</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(stagiaires.map(s => s.specialite).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stagiaires List */}
        <div className="space-y-6">
          {stagiaires.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun stagiaire</h3>
              <p className="text-gray-500 mb-6">
                Aucun stagiaire n'a été ajouté pour le moment.
              </p>
              <Link href="/stagiaire/new">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter le premier stagiaire
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stagiaires.map((stagiaire) => (
                <StagiaireCard key={stagiaire.id} stagiaire={stagiaire} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/stagiaire/new">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">➕</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Ajouter un stagiaire</h3>
                    <p className="text-sm text-gray-500">Créer un nouveau profil</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/demande/new">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">📝</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Nouvelle demande</h3>
                    <p className="text-sm text-gray-500">Créer une demande de stage</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/stage">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">🎓</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Voir les stages</h3>
                    <p className="text-sm text-gray-500">Gérer les stages en cours</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page; 