import httpApi from ".";


export const loginRequest = async (formdata) => await httpApi.post("/auth/login",formdata);
export const loadRequest = async () => await httpApi.get("/auth/load");