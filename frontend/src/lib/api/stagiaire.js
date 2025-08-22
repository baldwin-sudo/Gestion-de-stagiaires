// API base URL - adjust this to match your Go server
const API_BASE_URL = "http://localhost:8080"; // Change port if needed

// Generic API fetch function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Stagiaire API functions
const stagiaireApi = {
  // Get all stagiaires
  createStagiaire: (stagiaireData) =>
    apiRequest("/stagiaire", {
      method: "POST",
      body: JSON.stringify(stagiaireData),
    }),
  getAllStagiaires: () => apiRequest("/stagiaire/"),

  // Get stagiaire by ID
  getStagiaireById: (id) => apiRequest(`/stagiaire/${id}`),

  // Get stagiaire presence for a specific stage
  getStagiairePresence: (stagiaireId, stageId) => 
    apiRequest(`/stagiaire/${stagiaireId}/presence/${stageId}`),

  // Mark stagiaire present for today
  markStagiairePresent: (stagiaireId, stageId) => 
    apiRequest(`/stagiaire/${stagiaireId}/presence/${stageId}/today`, {
      method: "POST",
    }),

  // Create demande stage for stagiaire
  createDemandeForStagiaire: (stagiaireId, demandeData) => 
    apiRequest(`/stagiaire/${stagiaireId}/demande-stage`, {
      method: "POST",
      body: JSON.stringify(demandeData),
    }),

  // Update stagiaire
  updateStagiaire: (id, stagiaireData) => apiRequest(`/stagiaire/${id}`, {
    method: "PUT",
    body: JSON.stringify(stagiaireData),
  }),

  // Delete stagiaire
  deleteStagiaire: (id) => apiRequest(`/stagiaire/${id}`, {
    method: "DELETE",
  }),
};

export default stagiaireApi;
