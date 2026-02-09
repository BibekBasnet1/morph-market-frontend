export interface UserProfile {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string | null;
  postal_code: string | null;
  birth_date: string | null;
  bio: string | null;
  avatar: string | null;
  email_verified: boolean;
  created_at: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  postal_code?: string;
  birth_date?: string;
  bio?: string;
  avatar?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}