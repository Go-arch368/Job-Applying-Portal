import axios from 'axios';
const apiurl = (
    (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 
    "localhost:4010"
).replace(/["']+/g, '');

export default axios.create({
    baseURL: apiurl.startsWith("http") ? apiurl : `https://${apiurl}`
})