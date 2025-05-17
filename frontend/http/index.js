import axios from "axios";

const httpApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default httpApi;