import api from "./client";
import type { UsersListResponse, UserType } from "../../types/SellerOrBuyers";

export const BuyerOrSellerList = {
  async getBuyerOrSeller(type: UserType): Promise<UsersListResponse> {
    const res = await api.get("/admin/sellers-buyers", {
      params: { type }
    });
    return res.data;
  },
};