"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  demandeApi, 
  stageApi, 
  stagiaireApi, 
  themeApi 
} from "@/lib/api/index.js";

const StatCard = ({ title, value, icon, color, href, loading = false }) => {
  const Card = href ? Link : 'div';
  const cardProps = href ? { href } : {};
  
  return (
    <Card 
      {...cardProps}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${href ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

const QuickActionCard = ({ title, description, icon, href, color }) => (
  <Link href={href}>
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group`}>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="ml-4 text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </Link>
);

const RecentDemandeCard = ({ demande }) => (
  <Link href={`/demande/${demande.id}`}>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">Demande #{demande.id}</h4>
          <p className="text-sm text-gray-500">
            {new Date(demande.created_at).toLocaleDateString('fr-FR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          demande.statut_demande === 'validee' ? 'bg-green-100 text-green-800' :
          demande.statut_demande === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {demande.statut_demande === 'validee' ? 'Validée' :
           demande.statut_demande === 'en_attente' ? 'En attente' : 'Rejetée'}
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-sm font-medium">
            {demande.Stagiaire?.nom?.[0]}{demande.Stagiaire?.prenom?.[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {demande.Stagiaire?.nom || "N/A"} {demande.Stagiaire?.prenom || ""}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {demande.Theme?.sujet || "Thème non spécifié"}
          </p>
        </div>
      </div>
    </div>
  </Link>
);

export default function Home() {
  const [stats, setStats] = useState({
    demandes: 0,
    stages: 0,
    stagiaires: 0,
    themes: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentDemandes, setRecentDemandes] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [demandesRes, stagesRes, stagiairesRes, themesRes] = await Promise.all([
          demandeApi.getAllDemandes(),
          stageApi.getAllStages(),
          stagiaireApi.getAllStagiaires(),
          themeApi.getAllThemes()
        ]);

        setStats({
          demandes: demandesRes.data?.length || 0,
          stages: stagesRes.data?.length || 0,
          stagiaires: stagiairesRes.data?.length || 0,
          themes: themesRes.data?.length || 0
        });

        // Get recent demandes (last 5)
        const recent = demandesRes.data?.slice(0, 5) || [];
        setRecentDemandes(recent);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Nouvelle Demande",
      description: "Créer une nouvelle demande de stage pour un étudiant",
      icon: "📝",
      href: "/demande/new",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Nouveau Stage",
      description: "Créer un nouveau stage à partir d'une demande validée",
      icon: "🎓",
      href: "/stage/new",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Nouveau Stagiaire",
      description: "Ajouter un nouveau stagiaire au système",
      icon: "👤",
      href: "/stagiaire/new",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Nouveau Thème",
      description: "Créer un nouveau thème de stage disponible",
      icon: "🎯",
      href: "/offre/new",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue dans votre système de gestion des stages
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Demandes"
            value={stats.demandes}
            icon="📋"
            color="bg-blue-100 text-blue-600"
            href="/demande"
            loading={loading}
          />
          <StatCard
            title="Stages"
            value={stats.stages}
            icon="🎓"
            color="bg-green-100 text-green-600"
            href="/stage"
            loading={loading}
          />
          <StatCard
            title="Stagiaires"
            value={stats.stagiaires}
            icon="👥"
            color="bg-purple-100 text-purple-600"
            href="/stagiaire"
            loading={loading}
          />
          <StatCard
            title="Offres"
            value={stats.themes}
            icon="🎯"
            color="bg-orange-100 text-orange-600"
            href="/offre/all"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  href={action.href}
                  color={action.color}
                />
              ))}
            </div>
          </div>

          {/* Recent Demandes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Demandes récentes</h2>
              <Link href="/demande">
                <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir toutes →
                </span>
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentDemandes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande récente</h3>
                <p className="text-gray-500 mb-4">
                  Aucune demande n'a été créée pour le moment.
                </p>
                <Link href="/demande/new">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Créer une demande
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDemandes.map((demande) => (
                  <RecentDemandeCard key={demande.id} demande={demande} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">État du système</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">API Backend</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Base de données</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Interface utilisateur</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
