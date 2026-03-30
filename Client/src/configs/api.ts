import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_STRAPI_API_URL || "https://timely-passion-8556e12d20.strapiapp.com",
})

export default api;