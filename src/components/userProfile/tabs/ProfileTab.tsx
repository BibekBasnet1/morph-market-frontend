import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textArea";
import { Button } from "../../ui/button";
import Label from "../../ui/label";
import Spinner from "../../ui/spinner";
import { ProfileService } from "../../../lib/api/buyer/profile";
import type { UpdateProfileData } from "../../../types/buyer/Profile";
import toast from "react-hot-toast";
import { Calendar } from "lucide-react";

type ProfileForm = {
  name: string;
  phone: string;
  postal_code: string;
  birth_date: string;
  bio: string;
  avatar: string;
};

const ProfileTab = () => {
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    postal_code: "",
    birth_date: "",
    bio: "",
    avatar: "",
  });

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await ProfileService.getProfile();
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => ProfileService.updateProfile(data),
    onSuccess: (response) => {
      toast.success(response.message || "Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.user = { ...parsed.user, ...response.data };
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        } catch (error) {
          console.error('Failed to update auth storage:', error);
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  useEffect(() => {
    if (profileData) {
      setForm({
        name: profileData.name || "",
        phone: profileData.phone || "",
        postal_code: profileData.postal_code || "",
        birth_date: profileData.birth_date || "",
        bio: profileData.bio || "",
        avatar: profileData.avatar || "",
      });
    }
  }, [profileData]);

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const updates: UpdateProfileData = {};
    
    if (form.name !== profileData?.name) updates.name = form.name;
    if (form.phone !== profileData?.phone) updates.phone = form.phone;
    if (form.postal_code !== profileData?.postal_code) updates.postal_code = form.postal_code;
    if (form.birth_date !== profileData?.birth_date) updates.birth_date = form.birth_date;
    if (form.bio !== profileData?.bio) updates.bio = form.bio;
    if (form.avatar !== profileData?.avatar) updates.avatar = form.avatar;

    if (Object.keys(updates).length === 0) {
      toast.error("No changes to save");
      return;
    }

    updateMutation.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive font-medium">Failed to load profile</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['user-profile'] })} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border dark:border-border bg-card dark:bg-card p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Personal Information</h3>
          <p className="text-sm text-muted-foreground">
            Your basic account details
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Enter your full name"
            className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              value={profileData?.email || ""}
              disabled
              className="bg-muted dark:bg-muted text-muted-foreground cursor-not-allowed"
            />
            {profileData?.email_verified && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 dark:text-green-400 font-medium">
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={profileData?.username || ""}
            disabled
            className="bg-muted dark:bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">Username cannot be changed</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={e => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="postal">Postal Code</Label>
          <Input
            id="postal"
            value={form.postal_code}
            onChange={e => handleChange("postal_code", e.target.value)}
            placeholder="Enter postal code"
            className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="birth_date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Birth Date
          </Label>
          <Input
            id="birth_date"
            type="date"
            value={form.birth_date}
            onChange={e => handleChange("birth_date", e.target.value)}
            className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground"
          />
        </div>
      </div>

      {/* About & Avatar */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border dark:border-border bg-card dark:bg-card p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground">About</h3>
            <p className="text-sm text-muted-foreground">
              Tell others about yourself
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={5}
              value={form.bio}
              onChange={e => handleChange("bio", e.target.value)}
              placeholder="Write something about yourself..."
              maxLength={1000}
              className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.bio.length}/1000 characters
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border dark:border-border bg-card dark:bg-card p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Avatar</h3>
            <p className="text-sm text-muted-foreground">
              Your profile picture URL
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              type="url"
              value={form.avatar}
              onChange={e => handleChange("avatar", e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground"
            />
          </div>

          {form.avatar && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={form.avatar}
                  alt="Avatar preview"
                  className="h-24 w-24 rounded-full object-cover border-2 border-border dark:border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+URL";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <Button 
          className="w-full" 
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;