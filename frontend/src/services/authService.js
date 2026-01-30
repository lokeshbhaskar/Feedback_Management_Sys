import axiosInstance from "../utils/axiosInstance";

export const signupOwner = (data) => {
  const res = axiosInstance.post("/auth/signup-owner", {
    owner_name: data.ownerName,
    company_name: data.companyName,
    email: data.email,
    password: data.password,
  });
  return res.data;
};

export const login = (data) => axiosInstance.post("/auth/login", data);

export const getMe = () => axiosInstance.get("/auth/me");
