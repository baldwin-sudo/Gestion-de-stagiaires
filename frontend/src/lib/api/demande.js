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
const demandeApi = {
  // Get all demandes
  getAllDemandes: () => apiRequest("/demande-stage/"),

  // Get demande by ID
  getDemandeById: (id) => apiRequest(`/demande-stage/${id}`),

  // Create new demande
  createDemande: (demandeData) => {
    const formData = new FormData();
    formData.append("id_theme", demandeData.id_theme);
    formData.append("id_stagiaire", demandeData.id_stagiaire);
    if (demandeData.departement) {
      formData.append("departement", demandeData.departement);
    }

    return apiRequest("/demande-stage/", {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  },

  // Update demande
  updateDemande: (id, demandeData) => apiRequest(`/demande-stage/${id}`, {
    method: "PUT",
    body: JSON.stringify(demandeData),
  }),

  // Delete demande
  deleteDemande: (id) => apiRequest(`/demande-stage/${id}`, {
    method: "DELETE",
  }),
};

export default demandeApi;
