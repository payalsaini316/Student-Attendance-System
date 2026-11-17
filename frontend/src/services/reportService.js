
import api from "./api";

export const getReportData = async (filters = {}) => {
  const response = await api.get("/attendance", {
    params: filters
  });

  return response.data.records;
};
