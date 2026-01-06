import { useEffect, useState } from "react";
import { Store, MapPin, FileText, Image, Clock, CheckCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textArea";
import { Button } from "../../components/ui/button";
import Label from "../../components/ui/label";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { StoreForm } from "../../types/StoreType";
import { StoreService } from "../../lib/api/stores";
import { useAuth } from "../../contexts/AuthContext";
import { slugify } from "../../lib/slugify";
import { 
  storeSchema, 
  storeInfoSchema, 
  addressStepSchema, 
  detailsSchema, 
  mediaSchema, 
  hoursSchema 
} from "../../validation/StoreSchema";
import { z } from "zod";

export default function StoreRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const user = useAuth();
  console.log(user);
  
  const [formData, setFormData] = useState<StoreForm>({
    user_id: "",
    name: "",
    slug: "",
    email: "",
    username: "",
    brand_name: "",
    phone: "",
    policy: "",
    about: "",
    cover_photo: null,
    logo: null,
    contact_visible: true,
    is_active: true,
    is_verified: false,
    shipping_type: "national",
    store_hours: [
      { day: "monday", open_time: "09:00", close_time: "18:00", is_open: true },
      { day: "tuesday", open_time: "09:00", close_time: "18:00", is_open: true },
      { day: "wednesday", open_time: "09:00", close_time: "18:00", is_open: true },
      { day: "thursday", open_time: "09:00", close_time: "18:00", is_open: true },
      { day: "friday", open_time: "09:00", close_time: "18:00", is_open: true },
      { day: "saturday", open_time: "09:00", close_time: "18:00", is_open: true },
      { day: "sunday", open_time: "09:00", close_time: "18:00", is_open: false }
    ],
    address: {
      country_id: "",
      state_id: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      zip_code: ""
    }
  });

    useEffect(() => {
    if (user?.user) {
      setFormData(prev => ({
        ...prev,
        email: user?.user?.email ?? "",
        username: user?.user?.username ?? "",
        user_id:user?.user?.id ?? "",
      }));
    }
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: (data: FormData) => StoreService.create(data),
    onSuccess: () => toast.success("Store registered successfully"),
    onError: () => toast.error("Failed to register store"),
  });

  const steps = [
    { name: "Store Info", icon: Store },
    { name: "Address", icon: MapPin },
    { name: "Details", icon: FileText },
    { name: "Media", icon: Image },
    { name: "Hours", icon: Clock },
    { name: "Review", icon: CheckCircle }
  ];

  const validateStep = (step: number): boolean => {
    setErrors({});
    
    try {
      switch (step) {
        case 0:
          storeInfoSchema.parse({
            name: formData.name,
            slug: formData.slug,
            email: formData.email,
            username: formData.username,
            brand_name: formData.brand_name,
            phone: formData.phone
          });
          break;
        case 1:
          addressStepSchema.parse({ address: formData.address });
          break;
        case 2:
          detailsSchema.parse({
            about: formData.about,
            policy: formData.policy,
            shipping_type: formData.shipping_type,
            contact_visible: formData.contact_visible,
          });
          break;
        case 3:
          mediaSchema.parse({
            cover_photo: formData.cover_photo,
            logo: formData.logo
          });
          break;
        case 4:
          hoursSchema.parse({ store_hours: formData.store_hours });
          break;
      }
      return true;
    }catch (error) {
  if (error instanceof z.ZodError) {
    console.log("Validation failed:", error.issues);
    const newErrors: Record<string, string> = {};
    error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      newErrors[path] = issue.message;
    });
    setErrors(newErrors);
    toast.error("Please fix the validation errors");
  }
  return false;
}
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleChange = (field: keyof StoreForm, value: any) => {
    setFormData({ ...formData, [field]: value });
    
    if (field === "name" && typeof value === "string") {
      setFormData(prev => ({ ...prev, name: value, slug: slugify(value) }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddressChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [field]: value }
    });
    
    // Clear error for this field
    const errorKey = `address.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleStoreHoursChange = (index: number, field: string, value: any) => {
    const newStoreHours = [...formData.store_hours];
    newStoreHours[index] = { ...newStoreHours[index], [field]: value };
    setFormData({ ...formData, store_hours: newStoreHours });
  };

  const handleFileChange = (field: "cover_photo" | "logo", file: File | null) => {
    setFormData({ ...formData, [field]: file });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    // Validate entire form
    const result = storeSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue:any) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      toast.error("Please fix all validation errors");
      return;
    }

    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof StoreForm];
      
      if (key === 'store_hours') {
        formData.store_hours.forEach((hour, index) => {
          formDataToSend.append(`store_hours[${index}][day]`, hour.day);
          formDataToSend.append(`store_hours[${index}][open_time]`, hour.open_time);
          formDataToSend.append(`store_hours[${index}][close_time]`, hour.close_time);
          formDataToSend.append(`store_hours[${index}][is_open]`, hour.is_open ? "1" : "0");
        });
      } else if (key === 'address') {
        Object.keys(formData.address).forEach((addressKey) => {
          formDataToSend.append(`address[${addressKey}]`, formData.address[addressKey as keyof typeof formData.address]);
        });
      } else if (key === 'cover_photo' || key === 'logo') {
        if (value) {
          formDataToSend.append(key, value as File);
        }
      } else {
        formDataToSend.append(key, value as string);
      }
    });

    saveMutation.mutate(formDataToSend);
  };

  const ErrorMessage = ({ field }: { field: string }) => {
    return errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className=" mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive
                      ? "bg-green-500 text-white shadow-lg"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium text-center ${
                    isActive ? "text-green-600" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Step 0: Store Info */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Store Information</h2>
              <p className="text-gray-600 mb-6">Step 1 of 6: Basic store details</p>
              
              <div className="space-y-4">
                <div>
                  <Label>Store Name *</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="My Awesome Store"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  <ErrorMessage field="name" />
                </div>

                <div>
                  <Label>Slug *</Label>
                  <Input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="my-awesome-store"
                    readOnly
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated from store name</p>
                  <ErrorMessage field="slug" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={user?.user?.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="store@example.com"
                      readOnly
                      className={errors.email ? "border-red-500" : ""}
                    />
                    <ErrorMessage field="email" />
                  </div>
                  <div>
                    <Label>Username *</Label>
                    <Input
                      type="text"
                      value={user?.user?.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      placeholder="mystore123"
                      readOnly
                      className={errors.username ? "border-red-500" : ""}
                    />
                    <ErrorMessage field="username" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Brand Name *</Label>
                    <Input
                      type="text"
                      value={formData.brand_name}
                      onChange={(e) => handleChange("brand_name", e.target.value)}
                      placeholder="Awesome Brand"
                      className={errors.brand_name ? "border-red-500" : ""}
                    />
                    <ErrorMessage field="brand_name" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1234567890"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    <ErrorMessage field="phone" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Address */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Address</h2>
              <p className="text-gray-600 mb-6">Step 2 of 6: Store location details</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Country ID</Label>
                    <Input
                      type="text"
                      value={formData.address.country_id}
                      onChange={(e) => handleAddressChange("country_id", e.target.value)}
                      placeholder="e.g., 1"
                      className={errors["address.country_id"] ? "border-red-500" : ""}
                    />
                    <ErrorMessage field="address.country_id" />
                  </div>
                  <div>
                    <Label>State ID</Label>
                    <Input
                      type="text"
                      value={formData.address.state_id}
                      onChange={(e) => handleAddressChange("state_id", e.target.value)}
                      placeholder="e.g., 1"
                      className={errors["address.state_id"] ? "border-red-500" : ""}
                    />
                    <ErrorMessage field="address.state_id" />
                  </div>
                </div>

                <div>
                  <Label>Address Line 1</Label>
                  <Input
                    type="text"
                    value={formData.address.address_line_1}
                    onChange={(e) => handleAddressChange("address_line_1", e.target.value)}
                    placeholder="123 Main Street"
                    className={errors["address.address_line_1"] ? "border-red-500" : ""}
                  />
                  <ErrorMessage field="address.address_line_1" />
                </div>

                <div>
                  <Label>Address Line 2</Label>
                  <Input
                    type="text"
                    value={formData.address.address_line_2}
                    onChange={(e) => handleAddressChange("address_line_2", e.target.value)}
                    placeholder="Suite 100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      placeholder="New York"
                      className={errors["address.city"] ? "border-red-500" : ""}
                    />
                    <ErrorMessage field="address.city" />
                  </div>
                  <div>
                    <Label>Zip Code</Label>
                    <Input
                      type="text"
                      value={formData.address.zip_code}
                      onChange={(e) => handleAddressChange("zip_code", e.target.value)}
                      placeholder="10001"
                      className={errors["address.zip_code"] ? "border-red-500" : ""}
                    />
                    <ErrorMessage field="address.zip_code" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Store Details</h2>
              <p className="text-gray-600 mb-6">Step 3 of 6: Additional information</p>
              
              <div className="space-y-4">
                <div>
                  <Label>About Store</Label>
                  <Textarea
                    value={formData.about}
                    onChange={(e) => handleChange("about", e.target.value)}
                    placeholder="Tell us about your store..."
                    rows={4}
                    className={errors.about ? "border-red-500" : ""}
                  />
                  <ErrorMessage field="about" />
                </div>

                <div>
                  <Label>Store Policy</Label>
                  <Textarea
                    value={formData.policy}
                    onChange={(e) => handleChange("policy", e.target.value)}
                    placeholder="Store policies and terms..."
                    rows={4}
                    className={errors.policy ? "border-red-500" : ""}
                  />
                  <ErrorMessage field="policy" />
                </div>

                <div>
                  <Label>Shipping Type</Label>
                  <select
                    value={formData.shipping_type}
                    onChange={(e) => handleChange("shipping_type", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="local_pickup">Local</option>
                    <option value="regional">Regional</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.contact_visible}
                      onChange={(e) => handleChange("contact_visible", e.target.checked)}
                      className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Contact Visible</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Media */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Media Upload</h2>
              <p className="text-gray-600 mb-6">Step 4 of 6: Upload store images</p>
              
              <div className="space-y-6">
                <div>
                  <Label>Cover Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("cover_photo", e.target.files?.[0] || null)}
                    className={errors.cover_photo ? "border-red-500" : ""}
                  />
                  {formData.cover_photo && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {formData.cover_photo.name}</p>
                  )}
                  <ErrorMessage field="cover_photo" />
                </div>

                <div>
                  <Label>Logo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("logo", e.target.files?.[0] || null)}
                    className={errors.logo ? "border-red-500" : ""}
                  />
                  {formData.logo && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {formData.logo.name}</p>
                  )}
                  <ErrorMessage field="logo" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Store Hours */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Store Hours</h2>
              <p className="text-gray-600 mb-6">Step 5 of 6: Set your operating hours</p>
              
              <div className="space-y-4">
                {formData.store_hours.map((hour, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4 mb-3">
                      <input
                        type="checkbox"
                        checked={hour.is_open}
                        onChange={(e) => handleStoreHoursChange(index, "is_open", e.target.checked)}
                        className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="font-medium text-gray-700 capitalize w-24">{hour.day}</span>
                    </div>
                    
                    {hour.is_open && (
                      <div className="grid grid-cols-2 gap-4 ml-8">
                        <div>
                          <Label>Open Time</Label>
                          <Input
                            type="time"
                            value={hour.open_time}
                            onChange={(e) => handleStoreHoursChange(index, "open_time", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Close Time</Label>
                          <Input
                            type="time"
                            value={hour.close_time}
                            onChange={(e) => handleStoreHoursChange(index, "close_time", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Review & Submit</h2>
              <p className="text-gray-600 mb-6">Step 6 of 6: Verify your information</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">Store Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">Name:</p>
                    <p className="text-gray-900">{formData.name || "-"}</p>
                    <p className="text-gray-600">Slug:</p>
                    <p className="text-gray-900">{formData.slug || "-"}</p>
                    <p className="text-gray-600">Email:</p>
                    <p className="text-gray-900">{user?.user?.email ? user?.user?.email : formData.email}</p>
                    <p className="text-gray-600">Username:</p>
                    <p className="text-gray-900">{formData.username || "-"}</p>
                    <p className="text-gray-600">Brand:</p>
                    <p className="text-gray-900">{formData.brand_name || "-"}</p>
                    <p className="text-gray-600">Phone:</p>
                    <p className="text-gray-900">{formData.phone || "-"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">Address</h3>
                  <div className="text-sm text-gray-900">
                    <p>{formData.address.address_line_1}</p>
                    {formData.address.address_line_2 && <p>{formData.address.address_line_2}</p>}
                    <p>{formData.address.city}, {formData.address.zip_code}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">Settings</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">Shipping:</p>
                    <p className="text-gray-900">{formData.shipping_type}</p>
                    <p className="text-gray-600">Verified:</p>
                    <p className="text-gray-900">{formData.is_verified ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">Operating Hours</h3>
                  <div className="space-y-1 text-sm">
                    {formData.store_hours.map((hour, idx) => (
                      <p key={idx} className="text-gray-900 capitalize">
                        {hour.day}: {hour.is_open ? `${hour.open_time} - ${hour.close_time}` : "Closed"}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
            >
              ← Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next Step →
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? "Submitting..." : "Submit Store"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}