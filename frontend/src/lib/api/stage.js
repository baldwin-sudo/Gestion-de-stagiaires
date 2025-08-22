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

// Stage API functions
const stageApi = {
  // Get all stages
  getAllStages: () => apiRequest("/stage/"),

  // Get stage by ID
  getStageById: (id) => apiRequest(`/stage/${id}`),

  // Get stage options (encadrants, parrains, assistantes, demandes)
  getStageOptions: () => apiRequest("/stage/options"),

  // Create new stage
  createStage: (stageData) => apiRequest("/stage/", {
    method: "POST",
    body: JSON.stringify(stageData),
  }),

  // Update stage
  updateStage: (id, stageData) => apiRequest(`/stage/${id}`, {
    method: "PUT",
    body: JSON.stringify(stageData),
  }),

  // Delete stage
  deleteStage: (id) => apiRequest(`/stage/${id}`, {
    method: "DELETE",
  }),
};

export default stageApi;
