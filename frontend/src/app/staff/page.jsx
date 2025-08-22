"use client";
import Link from "next/link";

const StaffCard = ({ title, description, icon, href, color, count = 0 }) => (
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
            <span className="text-sm font-medium text-gray-700">{count} membres</span>
          </div>
        )}
      </div>
    </div>
  </Link>
);

export default function Page() {
  const staffCategories = [
    {
      title: "Parrains",
      description: "Gérer les parrains qui accompagnent les stagiaires dans leur parcours professionnel",
      icon: "👨‍💼",
      href: "/parrain",
      color: "bg-blue-100 text-blue-600",
      count: 5 // You can make this dynamic by fetching from API
    },
    {
      title: "Encadrants",
      description: "Gérer les encadrants qui supervisent les projets de stage et guident les stagiaires",
      icon: "👨‍🏫",
      href: "/encadrant",
      color: "bg-green-100 text-green-600",
      count: 5 // You can make this dynamic by fetching from API
    },
    {
      title: "Assistantes",
      description: "Gérer les assistantes qui coordonnent les stages et assistent dans l'administration",
      icon: "👩‍💼",
      href: "/assistante",
      color: "bg-purple-100 text-purple-600",
      count: 5 // You can make this dynamic by fetching from API
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion du personnel</h1>
          <p className="text-gray-600">
            Gérez les différents membres du personnel impliqués dans les stages
          </p>
        </div>

        {/* Staff Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffCategories.map((category, index) => (
            <StaffCard
              key={index}
              title={category.title}
              description={category.description}
              icon={category.icon}
              href={category.href}
              color={category.color}
              count={category.count}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu du personnel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-sm text-gray-600">Total du personnel</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Nouveaux ce mois</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 