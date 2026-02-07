import api from "../client";
import type { UserDetail } from "../../../types/admin/UserDetailResource";

interface UserDetailResponse {
  success: boolean;
  message: string;
  data: UserDetail;
}

export const SellerView = {
    getSellerDetail: async (sellerId: number): Promise<UserDetailResponse> => {
        const res = await api.get(`/admin/user-detail/${sellerId}`);
        return res.data;
    },

    revokeSellerRole: async (sellerId: number, reason?: string, notes?: string): Promise<{ success: boolean; message: string }> => {
        const res = await api.post(`/admin/sellers/${sellerId}/revoke-seller-role`, {
            reason,
            notes
        });
        return res.data;
    },

    // Update store status
    updateStoreStatus: async (
        sellerId: number, 
        storeId: number, 
        status: { is_active?: boolean; is_verified?: boolean; is_draft?: boolean },
        notes?: string
    ): Promise<{ success: boolean; message: string }> => {
        const res = await api.post(`/admin/sellers/${sellerId}/update-store-status`, {
            store_id: storeId,
            ...status,
            notes
        });
        return res.data;
    }
}