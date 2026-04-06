import { apiClient } from "./client";

export const getUsersApi = async (params) => {
  const { data } = await apiClient.get("/users", { params });
  return data;
};

export const createUserApi = async (payload) => {
  const { data } = await apiClient.post("/users", payload);
  return data;
};

export const updateUserRoleApi = async (id, role) => {
  const { data } = await apiClient.patch(`/users/${id}/role`, { role });
  return data;
};

export const updateUserStatusApi = async (id, isActive) => {
  const { data } = await apiClient.patch(`/users/${id}/status`, { isActive });
  return data;
};
