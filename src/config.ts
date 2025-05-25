// Get the backend URL from environment variables
export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "https://buzz-1-8j01.onrender.com/api/v1";

// Make sure the URL doesn't end with a slash to avoid double slashes in API calls
if (BACKEND_URL.endsWith('/')) {
    console.warn('BACKEND_URL should not end with a forward slash (/). Please update your environment variables.');
}