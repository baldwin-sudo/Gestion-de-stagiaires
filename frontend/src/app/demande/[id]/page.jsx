const Card = ({ children }) => (
  <div className="max-w-md w-full min-w-md min-h-36 h-fit p-6 border border-gray-200 rounded-lg shadow-md bg-white">
    {children}
  </div>
);

const Page = ({}) => {
  const mock = {
    id: 1,
    statut_demande: "validee",
    motif_rejet: "",
    id_theme: 3,
    id_stagiaire: 10,
    id_parrain: 5,
    created_at: "2025-07-24T10:30:00Z",
    updated_at: "2025-07-24T11:00:00Z",

    theme: {
      id: 3,
      titre: "Optimisation des performances backend",
      description: "Étude et amélioration d'une API REST avec Go.",
    },
    stagiaire: {
      id: 10,
      nom: "Amine Fakir",
      email: "amine@example.com",
      ecole: "Ensias",
      formation: "ingenieurie logiciel ",
    },
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const statusColors = {
    validee: "text-green-600",
    en_attente: "text-orange-500",
    rejetee: "text-red-600",
  };

  return (
    <div className="min-h-screen w-full  bg-gray-50 flex flex-col justify-center  items-center  py-16 px-6 gap-8">
      <div className="flex flex-row justify-center gap-8 flex-wrap">
        {/* Left column: Demande + Theme */}
        <div className="flex flex-col gap-8">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">
              Demande de stage #{mock.id}
            </h2>
            <p className="mb-2">
              <span className="font-semibold">Statut : </span>
              <span
                className={statusColors[mock.statut_demande] || "text-gray-900"}
              >
                {mock.statut_demande.replace("_", " ")}
              </span>
            </p>

            {mock.statut_demande === "rejetee" && (
              <p className="mb-2 text-red-600 font-semibold">
                Motif du rejet : {mock.motif_rejet || "(non précisé)"}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-4">
              Créée le : {formatDate(mock.created_at)} <br />
              Dernière mise à jour : {formatDate(mock.updated_at)}
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-2">Thème</h3>
            <p className="font-medium mb-1">{mock.theme.titre}</p>
            <p className="text-gray-700">{mock.theme.description}</p>
          </Card>
        </div>

        {/* Right column: Stagiaire */}
        <Card>
          <h3 className="text-xl font-semibold mb-2">Stagiaire</h3>
          <p>
            <span className="font-semibold text-blue-700">Nom Complet :</span>{" "}
            {mock.stagiaire.nom}
          </p>
          <p className="text-blue-600 hover:underline">
            <span className="font-semibold text-blue-700">
              Adresse courrier :
            </span>{" "}
            {mock.stagiaire.email}
          </p>
          <p>
            <span className="font-semibold text-blue-700">École :</span>{" "}
            {mock.stagiaire.ecole}
          </p>
          <p>
            <span className="font-semibold text-blue-700">Formation : </span>
            {mock.stagiaire.formation}
          </p>
          <p>
            <span className="font-semibold text-blue-700">CV : </span>link to cv
          </p>
        </Card>
      </div>

      {/* Buttons outside the cards */}
      <div className="flex flex-row justify-center   gap-4 mt-8">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Valider
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          Rejeter
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Modifier
        </button>
      </div>
    </div>
  );
};

export default Page;
