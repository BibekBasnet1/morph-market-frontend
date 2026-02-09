import api from "./client";

export const CountryService = {
  async getAll() {
    const res = await api.get("/countries");
    return res.data.data;
  },
};