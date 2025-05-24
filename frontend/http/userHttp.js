import httpApi from ".";


export const createRequest = async (formdata) => await httpApi.post("/user/create",formdata);
export const getRequest = async () => await httpApi.get("/user/get");
export const updateRequest = async (formdata,username) => await httpApi.put(`/user/update/${username}`,formdata);
export const deleteRequest = async (username) => await httpApi.delete(`/user/delete/${username}`);