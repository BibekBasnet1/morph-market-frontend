import api from "./client";

export const CountryService = {
  async getAll() {
    const res = await api.get("/countries");
    console.log("countries response:", res);
    return res.data.data;
  },
};