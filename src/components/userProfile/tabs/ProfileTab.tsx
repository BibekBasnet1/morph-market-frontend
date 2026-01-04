import { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textArea";
import { Button } from "../../ui/button";
import Label from "../../ui/label";

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  postal_code: string;
  bio: string;
};

const STORAGE_KEY = "auth-storage";

const ProfileTab = () => {
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    postal_code: "",
    bio: "",
  });

  /* ---------------- Load from localStorage ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const user = parsed.user;

      if (!user) return;

      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        postal_code: user.postal_code ?? "",
        bio: user.bio ?? "",
      });
    } catch {
      console.error("Invalid auth-storage format");
    }
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleChange = (key: keyof ProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // API call will go here later
    console.log("Updated profile:", form);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

      {/* Personal Information */}
      <div className="rounded-xl border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          Your basic account details
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            value={form.email}
            disabled
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={e => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="postal">Postal Code</Label>
          <Input
            id="postal"
            value={form.postal_code}
            onChange={e => handleChange("postal_code", e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
      </div>

      {/* About */}
      <div className="rounded-xl border p-6 space-y-4">
        <h3 className="text-lg font-semibold">About</h3>
        <p className="text-sm text-muted-foreground">
          Tell others about yourself
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            value={form.bio}
            onChange={e => handleChange("bio", e.target.value)}
            placeholder="Write something about yourself"
          />
        </div>

        <Button className="w-full mt-4" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
