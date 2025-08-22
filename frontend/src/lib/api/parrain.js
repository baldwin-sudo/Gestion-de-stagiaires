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

// Parrain API functions
const parrainApi = {
  // Get all parrains
  getAllParrains: () => apiRequest("/parrain/"),

  // Get parrain by ID
  getParrainById: (id) => apiRequest(`/parrain/${id}`),

  // Create new parrain
  createParrain: (parrainData) => apiRequest("/parrain/", {
    method: "POST",
    body: JSON.stringify(parrainData),
  }),

  // Update parrain
  updateParrain: (id, parrainData) => apiRequest(`/parrain/${id}`, {
    method: "PUT",
    body: JSON.stringify(parrainData),
  }),

  // Delete parrain
  deleteParrain: (id) => apiRequest(`/parrain/${id}`, {
    method: "DELETE",
  }),
};

export default parrainApi;
