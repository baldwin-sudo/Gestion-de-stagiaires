"use client";
import Link from "next/link";

const OfferCard = ({ title, description, icon, href, color, count = 0 }) => (
  <Link href={href}>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
      <div className="flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform mb-6`}>
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        {count > 0 && (
          <div className="bg-gray-100 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-gray-700">{count} offres</span>
          </div>
        )}
      </div>
    </div>
  </Link>
);

const Page = () => {
  const offerActions = [
    {
      title: "Créer une offre",
      description: "Publier une nouvelle offre de stage avec tous les détails nécessaires",
      icon: "➕",
      href: "/offre/new",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Consulter les offres",
      description: "Voir toutes les offres de stage disponibles et gérer leur statut",
      icon: "📋",
      href: "/offre/all",
      color: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des offres</h1>
          <p className="text-gray-600">
            Créez et gérez les offres de stage disponibles pour les étudiants
          </p>
        </div>

        {/* Offer Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {offerActions.map((action, index) => (
            <OfferCard
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
              color={action.color}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu des offres</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Total offres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">8</div>
              <div className="text-sm text-gray-600">Actives</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-sm text-gray-600">En cours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1</div>
              <div className="text-sm text-gray-600">Nouvelles</div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Conseils pour créer une bonne offre</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Décrivez clairement le projet et les objectifs</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Précisez les compétences requises</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Indiquez la durée et les dates importantes</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Mentionnez les avantages pour le stagiaire</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
