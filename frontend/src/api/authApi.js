import { apiClient } from "./client";

export const loginApi = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
};

export const registerApi = async (payload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
};

export const meApi = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};
