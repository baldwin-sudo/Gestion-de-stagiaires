"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { parrainApi } from "@/lib/api/index.js";

const ParrainCard = ({ parrain, onDelete }) => {
  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce parrain ?")) {
      onDelete(parrain.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-3 items-center space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-lg font-semibold">
            {parrain.nom?.[0]}{parrain.prenom?.[0]}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {parrain.nom} {parrain.prenom}   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Actif
          </span>
          </h3>
          <p className="text-gray-600">{parrain.departement || "Département non spécifié"}</p>
          {parrain.fonction && (
            <p className="text-sm text-gray-500">{parrain.fonction}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
        
          <Link href={`/parrain/${parrain.id}/edit`}>
            <button className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
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
    </div>
  );
};

const Page = () => {
  const [parrains, setParrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParrains = async () => {
      try {
        setLoading(true);
        const response = await parrainApi.getAllParrains();
        setParrains(response.parrains || []);
      } catch (err) {
        console.error("Error fetching parrains:", err);
        setError("Erreur lors du chargement des parrains");
      } finally {
        setLoading(false);
      }
    };
    fetchParrains();
  }, []);

  const handleDelete = async (parrainId) => {
    try {
      await parrainApi.deleteParrain(parrainId);
      setParrains(parrains.filter(parrain => parrain.id !== parrainId));
      alert("Parrain supprimé avec succès!");
    } catch (err) {
      console.error("Error deleting parrain:", err);
      alert("Erreur lors de la suppression du parrain");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">Chargement des parrains...</div>
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
              <div className="text-gray-500">Impossible de charger les parrains pour le moment.</div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des parrains</h1>
              <p className="text-gray-600">Gérez les parrains qui accompagnent les stagiaires</p>
            </div>
            <Link href="/parrain/new">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau parrain
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total parrains</p>
                  <p className="text-2xl font-bold text-gray-900">{parrains.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{parrains.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Départements</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(parrains.map(p => p.departement).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parrains List */}
        <div className="space-y-6">
          {parrains.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍💼</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun parrain</h3>
              <p className="text-gray-500 mb-6">
                Aucun parrain n'a été ajouté pour le moment.
              </p>
              <Link href="/parrain/new">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter le premier parrain
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parrains.map((parrain) => (
                <ParrainCard key={parrain.id} parrain={parrain} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page; 