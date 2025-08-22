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

// Theme Stage API functions
const themeApi = {
  // Get all theme stages
  getAllThemes: () => apiRequest("/theme_stage/"),

  // Get theme stage by ID
  getThemeById: (id) => apiRequest(`/theme_stage/${id}`),

  // Create new theme stage
  createTheme: (themeData) => apiRequest("/theme_stage/", {
    method: "POST",
    body: JSON.stringify(themeData),
  }),

  // Update theme stage
  updateTheme: (id, themeData) => apiRequest(`/theme_stage/${id}`, {
    method: "PUT",
    body: JSON.stringify(themeData),
  }),

  // Delete theme stage
  deleteTheme: (id) => apiRequest(`/theme_stage/${id}`, {
    method: "DELETE",
  }),
};

export default themeApi;
