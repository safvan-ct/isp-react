import axios from "axios";
import { getSiteLanguage } from "./siteLanguage";

// Create Axios Instance
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
	headers: {
		"Content-Type": "application/json",
	},
});

// Automatic Interceptor: Inject translation param (default 'en') into all API requests
apiClient.interceptors.request.use((config) => {
	config.params = config.params || {};
	if (!config.params.translation) {
		config.params.translation = getSiteLanguage() || "en";
	}
	return config;
});

/**
 * Helper to fetch local mock data simulating network latency.
 */
export const fetchMockData = async (endpoint, params = {}) => {
	await new Promise((resolve) => setTimeout(resolve, 150)); // low latency simulation

	switch (endpoint) {
		case "courses/tracks":
			return { data: [] };
		default:
			throw new Error(`Endpoint not mocked: ${endpoint}`);
	}
};

export default apiClient;
