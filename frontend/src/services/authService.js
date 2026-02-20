import axiosInstance from "../utils/axiosInstance";

export const signupOwner = async (data) => {
  const res = await axiosInstance.post("/auth/signup-owner", {
    owner_name: data.owner_name,
    company_name: data.company_name,
    email: data.email,
    password: data.password,
  });
  return res.data;
};

export const login = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};
