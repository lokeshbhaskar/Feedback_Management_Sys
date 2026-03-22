import axiosInstance from "../utils/axiosInstance";

export const getAnalyticsSummary = async (range = "30d") => {
  const res = await axiosInstance.get("/analytics/summary", {
    params: { range_key: range },
  });
  return res.data;
};
