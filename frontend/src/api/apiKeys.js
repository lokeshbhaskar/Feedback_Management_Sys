import axiosInstance from "../utils/axiosInstance";

export const getApiKeys = async () => {
  const res = await axiosInstance.get("/api-keys");
  return res.data;
};

export const generateApiKey = async () => {
  const res = await axiosInstance.post("/api-keys");
  return res.data;
};

export const revokeApiKey = async (id) => {
  const res = await axiosInstance.patch(`/api-keys/${id}/revoke`);
  return res.data;
};

