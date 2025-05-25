// Get the backend URL from environment variables or use a default value
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://buzz-1-8j01.onrender.com";

// Make sure the URL ends with a slash
if (!BACKEND_URL.endsWith('/')) {
    console.warn('BACKEND_URL should end with a forward slash (/). Please update your environment variables.');
}