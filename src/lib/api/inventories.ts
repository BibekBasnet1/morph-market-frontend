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
    console.log("InventoryService.getAllPrivate - FULL res:", res);
    console.log("InventoryService.getAllPrivate - res.data:", res.data);
    console.log("InventoryService.getAllPrivate - res.data.data:", res.data.data);
    
    // Handle the response structure
    let data = res.data.data;
    
    // If data has an 'original' property (Laravel response wrapper)
    if (data && typeof data === 'object' && 'original' in data) {
      const original = (data as any).original;
      if (Array.isArray(original)) {
        return original;
      }
      if (original && typeof original === 'object' && 'data' in original) {
        return (original as any).data;
      }
    }
    
    // If data is directly an array
    if (Array.isArray(data)) {
      return data;
    }
    
    // If data has a data property with array
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    
    console.warn("Unexpected response structure:", data);
    return [];
  },
};