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

// Encadrant API functions
const encadrantApi = {
  // Get all encadrants
  getAllEncadrants: () => apiRequest("/encadrant/"),

  // Get encadrant by ID
  getEncadrantById: (id) => apiRequest(`/encadrant/${id}`),

  // Create new encadrant
  createEncadrant: (encadrantData) => apiRequest("/encadrant/", {
    method: "POST",
    body: JSON.stringify(encadrantData),
  }),

  // Update encadrant
  updateEncadrant: (id, encadrantData) => apiRequest(`/encadrant/${id}`, {
    method: "PUT",
    body: JSON.stringify(encadrantData),
  }),

  // Delete encadrant
  deleteEncadrant: (id) => apiRequest(`/encadrant/${id}`, {
    method: "DELETE",
  }),
};

export default encadrantApi;
