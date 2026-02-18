import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
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

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const productId = id ? parseInt(id) : 0;

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
    existing_image_url: "" as string,
    existing_gallery_urls: [] as string[],
  });

  const getId = (val: any) => {
    if (!val) return 0;
    if (typeof val === "object") return (val.id as number) ?? 0;
    const n = Number(val);
    return Number.isNaN(n) ? 0 : n;
  };

  const handleChange = (key: string, value: any) => {
    if (key === "name") {
      setForm((prev) => ({ ...prev, name: value, slug: slugify(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* Fetch existing product data */
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductService.getById(productId),
    enabled: productId > 0,
  });

  /* Populate form when product data is loaded */
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        slug: product.slug || "",
        category_id: getId(product.category),
        price: (product.price && product.price.toString()) || (product.min_price && product.min_price.toString()) || "",
        location: product.location || "",
        breeder: product.breeder || "",
        gender_id: getId(product.gender),
        weight: product.specifications?.weight?.toString() || "",
        age: "",
        maturity_level_id: getId(product.maturity_level),
        origin_id: getId(product.origin),
        diet_ids: Array.isArray(product.diets) ? product.diets.map((d: any) => getId(d)) : (product.diet ? [getId(product.diet)] : []),
        tag_id: product.tag ? getId(product.tag) : 0,
        tag_ids: [],
        trait_ids: Array.isArray(product.traits) ? product.traits.map((t: any) => typeof t === 'object' ? getId(t) : t) : (product.trait_ids || []),
        description: product.description || "",
        image: null,
        gallery_images: [],
        existing_image_url: product.image_urls?.thumbnail?.url || "",
        existing_gallery_urls: product.image_urls?.gallery?.map((g: any) => g.url || g) || [],
      });
    }
  }, [product]);

  /* Queries */
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: CategoryService.getAll });
  const { data: tags = [] } = useQuery({ queryKey: ["tags"], queryFn: TagsService.getAll });
  const { data: traits = [] } = useQuery({ queryKey: ["traits"], queryFn: TraitsService.getAll });
  const { data: diets = [] } = useQuery({ queryKey: ["diets"], queryFn: DietService.getAll });
  const { data: maturities = [] } = useQuery({ queryKey: ["maturities"], queryFn: MaturityService.getAll });
  const { data: origins = [] } = useQuery({ queryKey: ["origins"], queryFn: OriginService.getAll });
  const { data: genders = [] } = useQuery({ queryKey: ["genders"], queryFn: GenderService.getAll });

  /* Mutation */
  const updateMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) return;
        if (key.startsWith("existing_")) return;
        if (value !== null && value !== undefined && value !== 0 && value !== "") {
          fd.append(key, value.toString());
        }
      });

      form.diet_ids.forEach((id) => fd.append("diet_ids[]", id.toString()));
      if (form.tag_id) fd.append("tag_id", form.tag_id.toString());
      form.trait_ids.forEach((id) => fd.append("trait_ids[]", id.toString()));
      if (form.image) fd.append("image", form.image);
      form.gallery_images.forEach((img) => fd.append("images[]", img));

      return ProductService.update(productId, fd);
    },
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: () => toast.error("Failed to update product"),
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
            <Label>Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              value={form.slug}
              readOnly
              className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Select
              value={form.category_id ? form.category_id.toString() : ""}
              options={categories.map((c) => ({ value: c.id.toString(), label: c.name }))}
              placeholder="Select Category"
              onChange={(v) => handleChange("category_id", Number(v))}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

          {/* <div>
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
            <Label>Weight</Label>
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
    {
      name: "Image",
      icon: ImageIcon,
      content: (
        <div className="grid gap-6">
          {/* Main Image */}
          <div className="space-y-2">
            <Label>Main Product Image</Label>
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
                    Remove New Image
                  </button>
                </div>
              ) : form.existing_image_url ? (
                <div className="space-y-2">
                  <img
                    src={form.existing_image_url}
                    alt="Current product image"
                    className="w-32 h-32 object-cover rounded mx-auto"
                  />
                  <p className="text-sm text-gray-500">Current Image</p>
                  <label className="cursor-pointer">
                    <p className="text-xs text-blue-500 hover:underline">
                      Click to replace
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChange("image", e.target.files ? e.target.files[0] : null)}
                      className="hidden"
                    />
                  </label>
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
            <Label>Gallery Images</Label>
            <div className="border-2 border-dashed rounded-lg p-4">
              <div className="space-y-3">
                {/* Existing Gallery Images */}
                {form.existing_gallery_urls.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Current Gallery</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {form.existing_gallery_urls.map((url, idx) => (
                        <div key={`existing-${idx}`} className="relative">
                          <img
                            src={url}
                            alt={`Gallery ${idx}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Gallery Images */}
                {form.gallery_images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">New Images</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {form.gallery_images.map((img, idx) => (
                        <div key={`new-${idx}`} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`New Gallery ${idx}`}
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
                  </div>
                )}

                {/* Upload More */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("gallery-add-more") as HTMLInputElement;
                      input?.click();
                    }}
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Add Gallery Images
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
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (isLoadingProduct) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={() => updateMutation.mutate()}
        isSubmitting={updateMutation.isPending}
        className="dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
  );
};

export default EditProductPage;
