import axiosInstance from "../utils/axiosInstance";

export const updatePassword = async ({ current_password, new_password }) => {
  const res = await axiosInstance.patch("/users/me/password", {
    current_password,
    new_password,
  });
  return res.data;
};

export const deleteMyAccount = async () => {
  const res = await axiosInstance.delete("/users/me");
  return res.data;
};
