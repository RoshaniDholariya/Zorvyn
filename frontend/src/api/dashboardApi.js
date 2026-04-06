import { apiClient } from "./client";

export const getDashboardSummaryApi = async (params) => {
  const sanitizedParams = Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
  const { data } = await apiClient.get("/dashboard", { params: sanitizedParams });
  return data;
};
