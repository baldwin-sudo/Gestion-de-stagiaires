"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = ({ params }) => {
  const { id } = params;
  const [stagiaire, setStagiaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStagiaire = async () => {
      try {
        const res = await fetch(`http://localhost:8080/stagiaire/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement");
        const data = await res.json();
        setStagiaire(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStagiaire();
  }, [id]);

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <Link href="/stagiaire">
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70 mb-4">
          Retour
        </button>
      </Link>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : stagiaire ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-900">Détails du Stagiaire</h2>
              <div className="flex space-x-2">
                <Link href={`/stagiaire/${stagiaire.id}/edit`}>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </button>
                </Link>
              </div>
            </div>
            <div className="mb-2"><span className="font-semibold">Nom:</span> {stagiaire.nom}</div>
            <div className="mb-2"><span className="font-semibold">Prénom:</span> {stagiaire.prenom}</div>
            <div className="mb-2"><span className="font-semibold">École:</span> {stagiaire.ecole}</div>
            <div className="mb-2"><span className="font-semibold">Spécialité:</span> {stagiaire.specialite}</div>
            <div className="mb-2"><span className="font-semibold">Créé le:</span> {stagiaire.created_at ? new Date(stagiaire.created_at).toLocaleString() : "-"}</div>
            <div className="mb-2"><span className="font-semibold">Mis à jour le:</span> {stagiaire.updated_at ? new Date(stagiaire.updated_at).toLocaleString() : "-"}</div>
          </>
        ) : (
          <p>Aucun stagiaire trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default Page; 