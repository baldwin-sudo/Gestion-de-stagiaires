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

// Demande API functions
const offreApi = {
  // Get all demandes
  getAllOffres: () => apiRequest("/theme_stage/"),

  // Get offre by ID
  getOffreById: (id) => apiRequest(`/theme_stage/${id}`),

  // Create new offre
  createOffre: (offreData) => {
    const formData = new FormData();
    formData.append("sujet", offreData.sujet);
    formData.append("departement", offreData.departement);
    formData.append("type", offreData.type);
    formData.append("date_debut", offreData.date_debut);
    formData.append("date_fin", offreData.date_fin);
    formData.append("description", offreData.description);
    formData.append("prerequisites", offreData.prerequisites);
    formData.append("duree", offreData.duree);
    formData.append("id_encadrant", offreData.id_encadrant);

    return apiRequest("/theme_stage/", {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  },

  // Update offre
  updateOffre: (id, offreData) => apiRequest(`/theme_stage/${id}`, {
    method: "PUT",
    body: JSON.stringify(offreData),
  }),

  // Delete offre
  deleteOffre: (id) => apiRequest(`/theme_stage/${id}`, {
    method: "DELETE",
  }),
};

export default offreApi;
