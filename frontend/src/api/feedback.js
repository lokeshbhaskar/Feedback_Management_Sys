import axiosInstance from "../utils/axiosInstance";

export const submitPublicFeedback = async (payload) => {
  const res = await axiosInstance.post("/feedback/public", payload);
  return res.data;
};

export const getFeedbackList = async (params = {}) => {
  const res = await axiosInstance.get("/feedback", { params });
  return res.data;
};

export const archiveFeedback = async (id) => {
  const res = await axiosInstance.patch(`/feedback/${id}/archive`);
  return res.data;
};

export const replyFeedback = async ({ id, reply_text }) => {
  const res = await axiosInstance.patch(`/feedback/${id}/reply`, { reply_text });
  return res.data;
};

export const exportFeedbackCsv = async () => {
  const res = await axiosInstance.get("/feedback/export", { responseType: "blob" });
  return res.data;
};
