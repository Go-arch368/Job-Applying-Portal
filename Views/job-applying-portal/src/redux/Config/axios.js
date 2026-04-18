import axios from 'axios';
// Use the Render backend URL in production, and localhost in local development
const defaultApiUrl = process.env.NODE_ENV === 'production' 
    ? "https://job-applying-portal.onrender.com" 
    : "http://localhost:4010";

// Try to grab from environment if provided (Vite or CRA)
let apiurl = (
    (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 
    defaultApiUrl
).replace(/["']+/g, '');

// Ensure http:// for localhost and https:// for everything else if no protocol was supplied
if (!apiurl.startsWith("http")) {
    apiurl = apiurl.includes("localhost") ? `http://${apiurl}` : `https://${apiurl}`;
}

export default axios.create({
    baseURL: apiurl
});