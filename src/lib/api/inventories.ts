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
};