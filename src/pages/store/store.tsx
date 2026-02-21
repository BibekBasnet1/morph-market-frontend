import { useEffect, useMemo, useState } from "react";
import { Store, MapPin, FileText, Image, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textArea";
import { Button } from "../../components/ui/button";
import Label from "../../components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { CountryService } from "../../lib/api/countries";
import Select from "../../components/ui/select";
import { StateService } from "../../lib/api/states";

const DEFAULT_STORE_HOURS = [
  { day: "monday", open_time: "09:00", close_time: "18:00", is_open: true },
  { day: "tuesday", open_time: "09:00", close_time: "18:00", is_open: true },
  { day: "wednesday", open_time: "09:00", close_time: "18:00", is_open: true },
  { day: "thursday", open_time: "09:00", close_time: "18:00", is_open: true },
  { day: "friday", open_time: "09:00", close_time: "18:00", is_open: true },
  { day: "saturday", open_time: "09:00", close_time: "18:00", is_open: true },
  { day: "sunday", open_time: "09:00", close_time: "18:00", is_open: false },
];

export default function StoreRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const user = useAuth();

  const {
    data: existingStore,
    isLoading: isStoreLoading,
  } = useQuery({
    queryKey: ["my-store"],
    queryFn: StoreService.getMyStore,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: countries = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: CountryService.getAll,
  });

  const countryOptions = countries.map((c: any) => ({
    value: c.id,
    label: c.name,
  }));

  

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
    store_hours: DEFAULT_STORE_HOURS,
    address: {
      country_id: "",
      state_id: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      zip_code: ""
    }
  });

  // Prefill from auth user
  useEffect(() => {
    if (user?.user) {
      setFormData(prev => ({
        ...prev,
        email: user.user?.email ?? prev.email,
        username: user.user?.username ?? prev.username,
        user_id: user.user?.id ?? prev.user_id,
      }));
    }
  }, [user]);

  // Prefill from existing store — matches actual API data structure
  useEffect(() => {
    if (!existingStore || isStoreLoading) return;

    const store = existingStore;

    // Merge store_hours: keep all 7 days from defaults, overlay with API data
    const mergedHours = DEFAULT_STORE_HOURS.map((defaultHour) => {
      const apiHour = store.store_hours?.find(
        (h: any) => h.day === defaultHour.day
      );
      if (apiHour) {
        return {
          day: apiHour.day,
          open_time: apiHour.open_time ?? defaultHour.open_time,
          close_time: apiHour.close_time ?? defaultHour.close_time,
          is_open: apiHour.is_open ?? false,
        };
      }
      return defaultHour;
    });

    setFormData(prev => ({
      ...prev,
      user_id: store.owner?.id?.toString() ?? prev.user_id,
      name: store.name ?? prev.name,
      slug: store.slug ?? prev.slug,
      email: store.email ?? prev.email,
      username: store.username ?? prev.username,
      brand_name: store.brand_name ?? prev.brand_name,
      phone: store.phone ?? "",
      policy: store.policy ?? "",
      about: store.about ?? "",
      contact_visible: store.contact_visible ?? true,
      is_active: store.is_active ?? true,
      is_verified: store.is_verified ?? false,
      shipping_type: store.shipping_type ?? "national",
      store_hours: mergedHours,
      // cover_photo and logo are file uploads — don't prefill File objects from URL strings
      cover_photo: null,
      logo: null,
      address: {
        country_id: store.address?.country_id ?? "",
        state_id: store.address?.state_id ?? "",
        address_line_1: store.address?.address_line_1 ?? "",
        address_line_2: store.address?.address_line_2 ?? "",
        city: store.address?.city ?? "",
        zip_code: store.address?.zip_code ?? "",
      },
    }));
  }, [existingStore, isStoreLoading]);

  // Use update mutation (store already exists)
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => StoreService.update(existingStore?.id, data),
    onSuccess: () => toast.success("Store updated successfully"),
    onError: () => toast.error("Failed to update store"),
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
    } catch (error) {
      if (error instanceof z.ZodError) {
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
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleChange = (field: keyof StoreForm, value: any) => {
    if (field === "name" && typeof value === "string") {
      setFormData(prev => ({ ...prev, name: value, slug: slugify(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddressChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value },
       ...(field === "country_id" ? { state_id: "" } : {}),
    }));
    const errorKey = `address.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleStoreHoursChange = (index: number, field: string, value: any) => {
    const newStoreHours = [...formData.store_hours];
    newStoreHours[index] = { ...newStoreHours[index], [field]: value };
    setFormData(prev => ({ ...prev, store_hours: newStoreHours }));
  };

  const handleFileChange = (field: "cover_photo" | "logo", file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

const handleSubmit = () => {
  // Validate only non-media steps since images are optional on update
  const stepsToValidate = [0, 1, 2, 4];
  let hasErrors = false;

  for (const step of stepsToValidate) {
    if (!validateStep(step)) {
      hasErrors = true;
      setCurrentStep(step); // jump to the failing step
      break;
    }
  }

  if (hasErrors) return;

  const formDataToSend = new FormData();
  formDataToSend.append("_method", "PUT");

  formDataToSend.append("user_id", String(formData.user_id));
  formDataToSend.append("name", formData.name);
  formDataToSend.append("slug", formData.slug);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("username", formData.username);
  formDataToSend.append("brand_name", formData.brand_name);
  formDataToSend.append("phone", formData.phone ?? "");
  formDataToSend.append("about", formData.about ?? "");
  formDataToSend.append("policy", formData.policy ?? "");
  formDataToSend.append("contact_visible", formData.contact_visible ? "1" : "0");
  formDataToSend.append("is_active", formData.is_active ? "1" : "0");
  formDataToSend.append("is_verified", formData.is_verified ? "1" : "0");
  formDataToSend.append("shipping_type", formData.shipping_type);

  // Only append images if a new file was selected
  if (formData.cover_photo instanceof File) {
    formDataToSend.append("cover_photo", formData.cover_photo);
  }
  if (formData.logo instanceof File) {
    formDataToSend.append("logo", formData.logo);
  }

  // Store hours — include the id from existingStore so Laravel updates, not inserts
  formData.store_hours.forEach((hour, index) => {
    const existingHour = existingStore?.store_hours?.[index];
   if (existingHour?.id) {
  formDataToSend.append(`store_hours[${index}][id]`, String(existingHour.id));
}
    formDataToSend.append(`store_hours[${index}][day]`, hour.day);
    formDataToSend.append(`store_hours[${index}][open_time]`, hour.open_time);
    formDataToSend.append(`store_hours[${index}][close_time]`, hour.close_time);
    formDataToSend.append(`store_hours[${index}][is_open]`, hour.is_open ? "1" : "0");
  });

  // Address
  Object.entries(formData.address).forEach(([key, val]) => {
    formDataToSend.append(`address[${key}]`, val ?? "");
  });

  updateMutation.mutate(formDataToSend);
};

const { data: states = [], isLoading: isStatesLoading } = useQuery({
  queryKey: ["states", formData.address.country_id],
  queryFn: () =>
    StateService.getByCountry(formData.address.country_id),
  enabled: !!formData.address.country_id, // only run when country selected
});

const stateOptions = useMemo(() => {
  return states.map((state: any) => ({
    value: state.id,
    label: state.name,
  }));
}, [states]);

  const ErrorMessage = ({ field }: { field: string }) => {
    return errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;
  };

  if (isStoreLoading) {
    return (
      <div className="min-h-screen dark:text-white dark:bg-gray-900 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading store details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:text-white dark:bg-gray-900 bg-gray-50 py-8 px-4">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Your Store</h1>

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
                    isActive || isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">

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
                    readOnly
                    placeholder="my-awesome-store"
                    className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated from store name</p>
                  <ErrorMessage field="slug" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      readOnly
                      placeholder="store@example.com"
                      className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                    />
                    <ErrorMessage field="email" />
                  </div>
                  <div>
                    <Label>Username *</Label>
                    <Input
                      type="text"
                      value={formData.username}
                      readOnly
                      placeholder="mystore123"
                      className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
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
                    <Label>Country</Label>
                    {isCountriesLoading ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading countries...</p>
                    ) : (
                      <Select
                        options={countryOptions}
                        value={formData.address.country_id}
                        placeholder="Select a country"
                        onChange={(val: any) => handleAddressChange("country_id", val)}
                      />
                    )}
                    <ErrorMessage field="address.country_id" />
                  </div>
                  <div>
                    <Label>State</Label>

                    {!formData.address.country_id ? (
                      <p className="text-gray-400 text-sm">
                        Please select a country first
                      </p>
                    ) : (
                      <Select
                        options={stateOptions}
                        value={formData.address.state_id}
                        // placeholder={isStatesLoading ? "Select a state" : "Select a state"}
                        placeholder="Select a state"
                        onChange={(val: any) => handleAddressChange("state_id", val)}
                        disabled={isStatesLoading}
                      />
                    )}
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

                <div>
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
                  {existingStore?.cover_photo && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Current cover photo:</p>
                      <img
                        src={existingStore.cover_photo}
                        alt="Current cover"
                        className="h-24 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("cover_photo", e.target.files?.[0] || null)}
                    className={errors.cover_photo ? "border-red-500" : ""}
                  />
                  {formData.cover_photo && (
                    <p className="mt-2 text-sm text-gray-600">New file: {formData.cover_photo.name}</p>
                  )}
                  {!existingStore?.cover_photo && !formData.cover_photo && (
                    <p className="text-xs text-gray-400 mt-1">No cover photo uploaded yet.</p>
                  )}
                  <ErrorMessage field="cover_photo" />
                </div>

                <div>
                  <Label>Logo</Label>
                  {existingStore?.logo && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Current logo:</p>
                      <img
                        src={existingStore.logo}
                        alt="Current logo"
                        className="h-16 w-16 object-cover rounded-full border"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("logo", e.target.files?.[0] || null)}
                    className={errors.logo ? "border-red-500" : ""}
                  />
                  {formData.logo && (
                    <p className="mt-2 text-sm text-gray-600">New file: {formData.logo.name}</p>
                  )}
                  {!existingStore?.logo && !formData.logo && (
                    <p className="text-xs text-gray-400 mt-1">No logo uploaded yet.</p>
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
                      {!hour.is_open && (
                        <span className="text-sm text-gray-400">Closed</span>
                      )}
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
                <div className="bg-gray-50 dark:bg-transparent p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Store Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600 dark:text-gray-300">Name:</p>
                    <p className="text-gray-900 dark:text-gray-300">{formData.name || "-"}</p>
                    <p className="text-gray-600 dark:text-gray-300">Slug:</p>
                    <p className="text-gray-900 dark:text-gray-300">{formData.slug || "-"}</p>
                    <p className="text-gray-600 dark:text-gray-300">Email:</p>
                    <p className="text-gray-900 dark:text-gray-300">{formData.email || "-"}</p>
                    <p className="text-gray-600 dark:text-gray-300">Username:</p>
                    <p className="text-gray-900 dark:text-gray-300">{formData.username || "-"}</p>
                    <p className="text-gray-600 dark:text-gray-300">Brand:</p>
                    <p className="text-gray-900 dark:text-gray-300">{formData.brand_name || "-"}</p>
                    <p className="text-gray-600 dark:text-gray-300">Phone:</p>
                    <p className="text-gray-900 dark:text-gray-300">{formData.phone || "-"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-transparent p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Address</h3>
                  <div className="text-sm text-gray-900 dark:text-gray-300">
                    {formData.address.address_line_1 ? (
                      <>
                        <p>{formData.address.address_line_1}</p>
                        {formData.address.address_line_2 && <p>{formData.address.address_line_2}</p>}
                        <p>{formData.address.city}{formData.address.zip_code ? `, ${formData.address.zip_code}` : ""}</p>
                      </>
                    ) : (
                      <p className="text-gray-400">No address provided</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-transparent p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Settings</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600 dark:text-white">Shipping:</p>
                    <p className="text-gray-900 dark:text-gray-300">{formData.shipping_type}</p>
                    <p className="text-gray-600 dark:text-white">Contact Visible:</p>
                    <p className="text-gray-900 dark:text-gray-300">{formData.contact_visible ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-transparent p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Operating Hours</h3>
                  <div className="space-y-1 text-sm">
                    {formData.store_hours.map((hour, idx) => (
                      <p key={idx} className="text-gray-900 dark:text-gray-300 capitalize">
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
            <Button onClick={handleBack} disabled={currentStep === 0} variant="outline">
              ← Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>Next Step →</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}