"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import SelectInput from "@/components/SelectInput";
import { demandeApi, stagiaireApi, themeApi } from "@/lib/api/index.js";

const Page = () => {
  const [stagiaireOptions, setStagiaireOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [selectedStagiaire, setSelectedStagiaire] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch stagiaires and themes from the API
        const [stagiairesRes, themesRes] = await Promise.all([
          stagiaireApi.getAllStagiaires(),
          themeApi.getAllThemes()
        ]);

        // Transform data for SelectInput component (object format)
        const stagiaires = stagiairesRes.data?.map(stagiaire => ({
          value: stagiaire.id.toString(),
          label: `${stagiaire.nom} ${stagiaire.prenom}`
        })) || [];

        const themes = themesRes.data?.map(theme => ({
          value: theme.id.toString(),
          label: theme.sujet
        })) || [];

        setStagiaireOptions(stagiaires);
        setThemeOptions(themes);
      } catch (error) {
        console.error("Failed to fetch options", error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStagiaire || !selectedTheme) {
      alert("Veuillez sélectionner un stagiaire et un thème");
      return;
    }

    setLoading(true);
    try {
      const demandeData = {
        id_theme: parseInt(selectedTheme),
        id_stagiaire: parseInt(selectedStagiaire)
      };

      const result = await demandeApi.createDemande(demandeData);
      alert("Demande créée avec succès!");
      
      // Reset form
      setSelectedStagiaire("");
      setSelectedTheme("");
    } catch (error) {
      console.error("Erreur lors de la création de la demande:", error);
      alert("Erreur lors de la création de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-100">
      <Link href="/demande">
        <button className="px-3 py-1.5 w-32 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:opacity-70">
          Retour{" "}
        </button>
      </Link>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white w-fit px-10 py-5 rounded-lg shadow-lg mx-auto mt-15"
      >
        <legend className="text-blue-600">Nouvelle Demande de stage</legend>
        <div className="flex flex-row items-end gap-10">
          <SelectInput
            label="Stagiaire"
            value={selectedStagiaire}
            options={stagiaireOptions}
            onChange={setSelectedStagiaire}
            placeholder="-- Selectionner stagiaire --"
          />
          <Link href="/stagiaire/new">
            <button 
              type="button"
              className="px-5 py-1.5 w-56 bg-green-600 text-white font-semibold transition-all duration-200 hover:opacity-70"
            >
              Creer stagiaire
            </button>
          </Link>
        </div>
        <div className="flex flex-row items-end gap-10">
          <SelectInput
            label="Thème de stage"
            value={selectedTheme}
            options={themeOptions}
            onChange={setSelectedTheme}
            placeholder="-- Selectionner thème --"
          />
          <Link href="/theme/new">
            <button 
              type="button"
              className="px-5 py-1.5 w-56 bg-yellow-600 text-white font-semibold transition-all duration-200 hover:opacity-70"
            >
              Creer Theme de stage
            </button>
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer la demande"}
        </button>
      </form>
    </div>
  );
};

export default Page;
