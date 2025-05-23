import axios from "axios";

const httpApi = axios.create({
    // baseURL: `https://freeswitch.onrender.com/api/v1`,
    baseURL: `http://localhost:4000/api/v1`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default httpApi;