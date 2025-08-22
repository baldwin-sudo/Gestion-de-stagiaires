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

// Assistante API functions
const assistanteApi = {
  // Get all assistantes
  getAllAssistantes: () => apiRequest("/assistante/"),

  // Get assistante by ID
  getAssistanteById: (id) => apiRequest(`/assistante/${id}`),

  // Create new assistante
  createAssistante: (assistanteData) => apiRequest("/assistante/", {
    method: "POST",
    body: JSON.stringify(assistanteData),
  }),

  // Update assistante
  updateAssistante: (id, assistanteData) => apiRequest(`/assistante/${id}`, {
    method: "PUT",
    body: JSON.stringify(assistanteData),
  }),

  // Delete assistante
  deleteAssistante: (id) => apiRequest(`/assistante/${id}`, {
    method: "DELETE",
  }),

  // Traiter demande (validate/reject)
  traiterDemande: (assistanteId, demandeId, action) => apiRequest(`/assistante/${assistanteId}/traiter-demande/${demandeId}`, {
    method: "PUT",
    body: JSON.stringify({ action }),
  }),
};

export default assistanteApi;
