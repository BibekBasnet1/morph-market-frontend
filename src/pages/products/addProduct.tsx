import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Package,
  Tags,
  Sliders,
  FileText,
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
  });

  const handleChange = (key: string, value: any) => {
    if (key === "name") {
      setForm((prev) => ({ ...prev, name: value, slug: slugify(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* Queries */
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: CategoryService.getAll });
  const { data: tags = [] } = useQuery({ queryKey: ["tags"], queryFn: TagsService.getAll });
  const { data: traits = [] } = useQuery({ queryKey: ["traits"], queryFn: TraitsService.getAll });
  const { data: diets = [] } = useQuery({ queryKey: ["diets"], queryFn: DietService.getAll });
  const { data: maturities = [] } = useQuery({ queryKey: ["maturities"], queryFn: MaturityService.getAll });
  const { data: origins = [] } = useQuery({ queryKey: ["origins"], queryFn: OriginService.getAll });
  const { data: genders = [] } = useQuery({ queryKey: ["genders"], queryFn: GenderService.getAll });

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

          <div>
            <Label>Price *</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
          </div>

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
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleChange("image", e.target.files ? e.target.files[0] : null)}
          className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-4">
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
