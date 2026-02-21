import api from "./client";

export const StateService = {
  async getByCountry(countryId:any) {
    const res = await api.get(`/countries/${countryId}/states`);
    return res.data.data;
  },
};