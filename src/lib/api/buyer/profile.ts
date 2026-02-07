import api from "../client";
import type { UpdateProfileData, ProfileResponse } from "../../../types/buyer/Profile";

export const ProfileService = {
  async getProfile(): Promise<ProfileResponse> {
    const res = await api.get('/profile');
    return res.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
    const res = await api.put('/profile', data);
    return res.data;
  },
};