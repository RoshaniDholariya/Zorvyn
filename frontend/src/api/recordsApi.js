import { apiClient } from "./client";

export const getRecordsApi = async (params) => {
  const { data } = await apiClient.get("/records", { params });
  return data;
};

export const createRecordApi = async (payload) => {
  const { data } = await apiClient.post("/records", payload);
  return data;
};

export const updateRecordApi = async (id, payload) => {
  const { data } = await apiClient.put(`/records/${id}`, payload);
  return data;
};

export const deleteRecordApi = async (id) => {
  const { data } = await apiClient.delete(`/records/${id}`);
  return data;
};
