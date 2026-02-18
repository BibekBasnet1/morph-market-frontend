import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Package,
  Tags,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";

import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
import { Textarea } from "../../components/ui/textArea";
import Select from "../../components/ui/select";
import MultiStepForm, { type Step } from "../../components/ui/multiStepForm/MultiStepForm";
import MultiSelect from "../../components/ui/dropdown/MultiSelect";

import { ProductService } from "../../lib/api/products";
import { CategoryService } from "../../lib/api/categories";
import { TagsService } from "../../lib/api/attributes/tags";
import { TraitsService } from "../../lib/api/attributes/traits";
import { DietService } from "../../lib/api/attributes/diet";
import { MaturityService } from "../../lib/api/attributes/maturity";
import { OriginService } from "../../lib/api/attributes/origin";
import { GenderService } from "../../lib/api/attributes/gender";
import { slugify } from "../../lib/slugify";

const AddProductPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: 0,
    price: "",
    location: "",
    breeder: "",
    gender_id: 0,
    weight: "",
    age: "",
    maturity_level_id: 0,
    origin_id: 0,
    diet_ids: [] as number[],
    tag_id: 0,
    tag_ids: [] as number[],
    trait_ids: [] as number[],
    description: "",
    image: null as File | null,
    gallery_images: [] as File[],
  });

  const handleChange = (key: string, value: any) => {
    if (key === "name") {
      setForm((prev) => ({ ...prev, name: value, slug: slugify(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* Queries */
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: CategoryService.getAllPublic });
  const { data: tags = [] } = useQuery({ queryKey: ["tags"], queryFn: TagsService.getAllPublic });
  const { data: traits = [] } = useQuery({ queryKey: ["traits"], queryFn: TraitsService.getAllPublic });
  const { data: diets = [] } = useQuery({ queryKey: ["diets"], queryFn: DietService.getAllPublic });
  const { data: maturities = [] } = useQuery({ queryKey: ["maturities"], queryFn: MaturityService.getAllPublic });
  const { data: origins = [] } = useQuery({ queryKey: ["origins"], queryFn: OriginService.getAllPublic });
  const { data: genders = [] } = useQuery({ queryKey: ["genders"], queryFn: GenderService.getAllPublic });

  /* Mutation */
  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) return;
        if (value !== null && value !== undefined && value !== 0 && value !== "") {
          fd.append(key, value.toString());
        }
      });

      form.diet_ids.forEach((id) => fd.append("diet_ids[]", id.toString()));
      if (form.tag_id) fd.append("tag_id", form.tag_id.toString());
      form.trait_ids.forEach((id) => fd.append("trait_ids[]", id.toString()));
      if (form.image) fd.append("image", form.image);
      
      // Add gallery images
      form.gallery_images.forEach((img) => fd.append("images[]", img));

      return ProductService.create(fd);
    },
    onSuccess: () => {
      toast.success("Product created");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: () => toast.error("Failed to create product"),
  });

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handleBack = () => setCurrentStep((s) => s - 1);

  /* Steps */
  const steps: Step[] = [
    {
      name: "Basic",
      icon: Package,
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Name <span className="text-green-500">*</span></Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div className="hidden">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              readOnly
              className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Category <span className="text-green-500">*</span></Label>
            <Select
              value={form.category_id ? form.category_id.toString() : ""}
              options={categories.map((c) => ({ value: c.id.toString(), label: c.name }))}
              placeholder="Select Category"
              onChange={(v) => handleChange("category_id", Number(v))}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>
          {/* 
          <div>
            <Label>Price *</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div> */}

          <div>
            <Label>Gender</Label>
            <Select
              value={form.gender_id ? form.gender_id.toString() : ""}
              options={genders.map((g) => ({ value: g.id.toString(), label: g.name }))}
              onChange={(v) => handleChange("gender_id", Number(v))}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>
          <div>
            <Label>Description about Product</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>
        </div>
      ),
    },
    {
      name: "Attributes",
      icon: Sliders,
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="w-full">
            <Label>Diets</Label>
            <MultiSelect
              options={diets.map((d) => ({ value: d.id.toString(), label: d.name }))}
              value={form.diet_ids.map(String)}
              placeholder="Select Diets"
              onChange={(values) => handleChange("diet_ids", values.map(Number))}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Maturity</Label>
            <Select
              value={form.maturity_level_id ? form.maturity_level_id.toString() : ""}
              options={maturities.map((m) => ({ value: m.id.toString(), label: m.name }))}
              placeholder="Maturity"
              onChange={(v) => handleChange("maturity_level_id", Number(v))}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Origin</Label>
            <Select
              value={form.origin_id ? form.origin_id.toString() : ""}
              options={origins.map((o) => ({ value: o.id.toString(), label: o.name }))}
              placeholder="Origin"
              onChange={(v) => handleChange("origin_id", Number(v))}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Weight (in grams)</Label>
            <Input
              value={form.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>
          <div>
            <Label>Tags</Label>
            <Select
              value={form.tag_id ? form.tag_id.toString() : ""}
              options={tags.map((t) => ({ value: t.id.toString(), label: t.name }))}
              placeholder="Tags"
              onChange={(v) => handleChange("tag_id", Number(v))}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>
        </div>
      ),
    },
    // {
    //   name: "Tags",
    //   icon: Tags,
    //   content: (
    //     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    //       <Label className="flex gap-2 items-center dark:text-gray-100">
    //           <Select
    //           value={form.tag_id ? form.tag_id.toString() : ""}
    //           options={tags.map((t) => ({ value: t.id.toString(), label: t.name }))}
    //           placeholder="Tags"
    //           onChange={(v) => handleChange("tag_id", Number(v))}
    //           className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
    //         />
    //         </Label>
    //     </div>
    //   ),
    // },
    {
      name: "Traits",
      icon: Tags,
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {traits.map((trait) => (
            <label key={trait.id} className="flex gap-2 items-center dark:text-gray-100">
              <input
                type="checkbox"
                checked={form.trait_ids.includes(trait.id)}
                onChange={(e) =>
                  handleChange(
                    "trait_ids",
                    e.target.checked
                      ? [...form.trait_ids, trait.id]
                      : form.trait_ids.filter((id) => id !== trait.id)
                  )
                }
                className="dark:bg-gray-800 dark:border-gray-700"
              />
              {trait.name}
            </label>
          ))}
        </div>
      ),
    },
    // {
    //   name: "Description",
    //   icon: FileText,
    //   content: (
    //     <>
    //     <Label>Description about Product</Label>
    //     <Textarea
    //     rows={4}
    //     value={form.description}
    //     onChange={(e) => handleChange("description", e.target.value)}
    //     className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
    //     />
    //     </>
    //   ),
    // },
    {
      name: "Image",
      icon: ImageIcon,
      content: (
        <div className="grid gap-6">
          {/* Main Image */}
          <div className="space-y-2">
            <Label>Main Product Image <span className="text-green-500">*</span></Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {form.image ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded mx-auto"
                  />
                  <p className="text-sm text-gray-500">{form.image.name}</p>
                  <button
                    type="button"
                    onClick={() => handleChange("image", null)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload main image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChange("image", e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <Label>Gallery Images (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4">
              {form.gallery_images.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {form.gallery_images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Gallery ${idx}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleChange(
                              "gallery_images",
                              form.gallery_images.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("gallery-add-more") as HTMLInputElement;
                        input?.click();
                      }}
                      className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Add more images
                    </button>
                    <input
                      id="gallery-add-more"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const newFiles = e.target.files ? Array.from(e.target.files) : [];
                        handleChange("gallery_images", [...form.gallery_images, ...newFiles]);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block text-center">
                  <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload gallery images (multiple)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files ? Array.from(e.target.files) : [];
                      handleChange("gallery_images", files);
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-full p-4">
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={() => createMutation.mutate()}
        isSubmitting={createMutation.isPending}
        className="dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
  );
};

export default AddProductPage;
