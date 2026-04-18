import axios from 'axios';
const apiurl = (import.meta.env.VITE_API_URL || "").replace(/[""]+/g, '');
export default axios.create({
    // baseURL:"http://localhost:4010"
    baseURL: apiurl.startsWith("http") ? apiurl : `http://${apiurl}`

})