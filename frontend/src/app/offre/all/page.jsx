"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { offreApi } from "@/lib/api/index.js";
const ThemeCard = ({ theme, onDelete }) => {
  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      onDelete(theme.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-blue-700">{theme.sujet}</h2>
        <div className="flex space-x-2">
          <Link href={`/offre/${theme.id}/edit`}>
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
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Département:</span> {theme.departement}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Type:</span> {theme.type.toUpperCase()}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Durée:</span> {theme.duree} jours
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Encadrant:</span>{" "}
        {theme.encadrant?.nom || "N/A"}
      </p>
      <p className="text-gray-600 mt-2">
        <span className="font-semibold">Description:</span>{" "}
        {theme.description.slice(0, 100)}...
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Début: {new Date(theme.date_debut).toLocaleDateString()} <br />
        Fin: {new Date(theme.date_fin).toLocaleDateString()}
      </p>
    </div>
  );
};

const Page = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await offreApi.getAllOffres(); // ✅ fixed
        setThemes(data.data);
      } catch (err) {
        console.error("Error fetching demandes:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (themeId) => {
    try {
      setLoading(true);
      await offreApi.deleteOffre(themeId);
      // Remove the deleted theme from the list
      setThemes(themes.filter(theme => theme.id !== themeId));
      alert("Offre supprimée avec succès!");
    } catch (err) {
      console.error("Error deleting theme:", err);
      alert("Erreur lors de la suppression de l'offre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-6 py-10">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">Thèmes de stage</h1>
      <Link href="/offre">
        <h3 className="mb-4 bg-blue-600 rounded-lg text-white w-fit  px-2 py-1 transition-all duration-200 hover:opacity-70">
          retour{" "}
        </h3>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.length === 0 ? (
          <p>Aucun thème disponible pour le moment.</p>
        ) : (
          themes.map((theme) => (
            <ThemeCard 
              key={theme.id} 
              theme={theme} 
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
