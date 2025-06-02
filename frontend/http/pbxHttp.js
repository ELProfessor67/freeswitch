import httpApi from ".";

// PBX requests
export const createPBXRequest = async (pbxData) => await httpApi.post("/pbx", pbxData);
export const getAllPBXsRequest = async () => await httpApi.get("/pbx");
export const getPBXRequest = async (id) => await httpApi.get(`/pbx/${id}`);
export const updatePBXRequest = async (id, pbxData) => await httpApi.put(`/pbx/${id}`, pbxData);
export const deletePBXRequest = async (id) => await httpApi.delete(`/pbx/${id}`);