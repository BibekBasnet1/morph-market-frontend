import type { InventoryItem } from "../../types";
import api from "./client";

export const InventoryService = {
  async getAll(): Promise<InventoryItem[]> {
    const res = await api.get("buyer/inventories");
    console.log("InventoryService.getAll - res.data:", res.data);
    return res.data.data;
  },
    create: async (payload: FormData): Promise<InventoryItem> => {
    const res = await api.post("/buyer/inventories", payload);
    return res.data.data;
  },
  update: async (id: number, payload: FormData): Promise<InventoryItem> => {
    const res = await api.put(`/buyer/inventories/${id}`, payload);
    return res.data.data;
  },
    async getAllPrivate(): Promise<InventoryItem[]> {
    const res = await api.get(`buyer/inventories/my-products`);
    console.log("InventoryService.getAllPrivate - res.data:", res.data);
    return res.data.data;
  },
};