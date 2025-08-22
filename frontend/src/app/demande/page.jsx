"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { demandeApi } from "@/lib/api/index.js";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    validee: { color: "bg-green-100 text-green-800", label: "Validée" },
    en_attente: { color: "bg-yellow-100 text-yellow-800", label: "En attente" },
    rejetee: { color: "bg-red-100 text-red-800", label: "Rejetée" }
  };
  
  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const StatCard = ({ title, value, icon, color, href }) => {
  const Card = href ? Link : 'div';
  const cardProps = href ? { href } : {};
  
  return (
    <Card 
      {...cardProps}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${href ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

const DemandeCard = ({ demande, onDelete }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      onDelete(demande.id);
    }
  };

  return (
    <Link href={`/demande/${demande.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Demande #{demande.id}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(demande.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={demande.statut_demande} />
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">
                {demande.Stagiaire?.nom?.[0]}{demande.Stagiaire?.prenom?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {demande.Stagiaire?.nom || "N/A"} {demande.Stagiaire?.prenom || ""}
              </p>
              <p className="text-sm text-gray-500">
                {demande.Stagiaire?.ecole || "École non spécifiée"}
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Thème:</span> {demande.Theme?.sujet || "Thème non spécifié"}
            </p>
            <p className="text-sm text-gray-500">
              {demande.Theme?.departement || "Département non spécifié"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Page = () => {
  const [demandeList, setDemandeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState("en_attente");
  const [stats, setStats] = useState({
    en_attente: 0,
    validee: 0,
    rejetee: 0,
    total: 0
  });

  const handleDelete = async (demandeId) => {
    try {
      await demandeApi.deleteDemande(demandeId);
      // Remove the deleted demande from the list
      setDemandeList(demandeList.filter(demande => demande.id !== demandeId));
      // Recalculate stats
      const updatedDemandes = demandeList.filter(demande => demande.id !== demandeId);
      const newStats = {
        en_attente: updatedDemandes.filter(d => d.statut_demande === "en_attente").length,
        validee: updatedDemandes.filter(d => d.statut_demande === "validee").length,
        rejetee: updatedDemandes.filter(d => d.statut_demande === "rejetee").length,
        total: updatedDemandes.length
      };
      setStats(newStats);
      alert("Demande supprimée avec succès!");
    } catch (err) {
      console.error("Error deleting demande:", err);
      alert("Erreur lors de la suppression de la demande");
    }
  };

  const cards = [
    {
      title: "En attente",
      value: stats.en_attente,
      icon: "⏳",
      color: "bg-yellow-100 text-yellow-600",
      status: "en_attente"
    },
    {
      title: "Validées",
      value: stats.validee,
      icon: "✅",
      color: "bg-green-100 text-green-600",
      status: "validee"
    },
    {
      title: "Rejetées",
      value: stats.rejetee,
      icon: "❌",
      color: "bg-red-100 text-red-600",
      status: "rejetee"
    },
    {
      title: "Total",
      value: stats.total,
      icon: "📊",
      color: "bg-blue-100 text-blue-600"
    }
  ];

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true);
        const data = await demandeApi.getAllDemandes();
        const demandes = data.data || [];
        setDemandeList(demandes);
        
        // Calculate stats
        const stats = {
          en_attente: demandes.filter(d => d.statut_demande === "en_attente").length,
          validee: demandes.filter(d => d.statut_demande === "validee").length,
          rejetee: demandes.filter(d => d.statut_demande === "rejetee").length,
          total: demandes.length
        };
        setStats(stats);
      } catch (err) {
        console.error("Error fetching demandes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const filteredDemandes = demandeList.filter(demande => 
    showList === "all" ? true : demande.statut_demande === showList
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg text-gray-600">Chargement des demandes...</div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des demandes</h1>
              <p className="text-gray-600">Suivez et gérez toutes les demandes de stage</p>
            </div>
            <Link href="/demande/new">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle demande
              </button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                href={card.status ? `/demande?status=${card.status}` : undefined}
              />
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8">
          <div className="flex space-x-1">
            {[
              { key: "en_attente", label: "En attente", icon: "⏳" },
              { key: "validee", label: "Validées", icon: "✅" },
              { key: "rejetee", label: "Rejetées", icon: "❌" },
              { key: "all", label: "Toutes", icon: "📋" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setShowList(tab.key)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showList === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demandes List */}
        <div className="space-y-6">
          {filteredDemandes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune demande {showList !== "all" ? `"${showList}"` : ""}
              </h3>
              <p className="text-gray-500 mb-6">
                {showList === "all" 
                  ? "Aucune demande n'a été créée pour le moment."
                  : `Aucune demande avec le statut "${showList}" n'a été trouvée.`
                }
              </p>
              {showList === "all" && (
                <Link href="/demande/new">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Créer la première demande
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDemandes.map((demande) => (
                <DemandeCard 
                  key={demande.id} 
                  demande={demande} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
