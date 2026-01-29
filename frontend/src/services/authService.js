import axiosInstance from "../utils/axiosInstance";

export const signupOwner = (data) =>
  axiosInstance.post("/auth/signup-owner", data);

export const login = (data) =>
  axiosInstance.post("/auth/login", data);

export const getMe = () =>
  axiosInstance.get("/auth/me"); // token automatically added
