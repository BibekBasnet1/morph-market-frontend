import api from "../client";
import type { UserDetail } from "../../../types/admin/UserDetailResource";

interface UserDetailResponse {
  success: boolean;
  message: string;
  data: UserDetail;
}

export const BuyerView = {
    getUserDetail: async (userId: number): Promise<UserDetailResponse> => {
        const res = await api.get(`/admin/user-detail/${userId}`);
        return res.data;
    },

    convertToSeller: async (userId: number, notes?: string): Promise<{ success: boolean; message: string }> => {
        const res = await api.post(`/admin/users/${userId}/assign-seller-role`, {
            notes 
        });
        return res.data;
    },

    updateStatus: async (userId: number, status: 'approved' | 'rejected', notes?: string): Promise<{ success: boolean; message: string }> => {
        const res = await api.post('/admin/users/update-status', {
            user_id: userId,
            status,
            notes
        });
        return res.data;
    }
}