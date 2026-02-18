import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textArea";
import { Trash2, Edit } from "lucide-react";
import { DietService } from "../../lib/api/attributes/diet";
import { slugify } from "../../lib/slugify";
import { Modal } from "../../components/ui/modal";
import type { Diet } from "../../types";

// Fallback images for diets by name
const dietImages: Record<string, string> = {
  meat: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop",
  eggs: "https://images.unsplash.com/photo-1582722872981-82a63300c9c6?w=400&h=400&fit=crop",
  grass: "https://images.unsplash.com/photo-1583693033351-e8f0b3e24c3e?w=400&h=400&fit=crop",
  anything: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop",
};

const AddDietPage = () => {
  const queryClient = useQueryClient();

  // Helper to get diet image from API or fallback
  const getDietImage = (diet: Diet) => {
    return (
      (diet as any)?.image_urls?.url ||
      (diet as any)?.image_urls?.thumb ||
      dietImages[(diet.name || "").toLowerCase()] ||
      "https://placehold.co/200x200"
    );
  };

  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: null as File | null,
  });

  const openAddModal = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditModal = (diet: Diet) => {
    setEditingId(diet.id);
    setForm({
      name: diet.name,
      slug: diet.slug,
      description: diet.description,
      image: null,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleChange = (key: string, value: any) => {
    if (key === "name") {
      setForm(prev => ({
        ...prev,
        name: value,
        slug: slugify(value),
      }));
      return;
    }
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", description: "", slug: "", image:null});
    setEditingId(null);
  };

  const { data: dietsData = [], isLoading } = useQuery({
    queryKey: ["diets"],
    queryFn: DietService.getAll,
  });

  // Handle both array and paginated response
  const diets = Array.isArray(dietsData) ? dietsData : (dietsData?.data || []);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      if (editingId) {
        const updated = await DietService.update(editingId, formData);
        return updated;
      } else {
        const created = await DietService.create(formData);
        return created;
      }
    },
    onSuccess: (diet: Diet) => {
      queryClient.setQueryData<Diet[]>(["diets"], old =>
        editingId
          ? old!.map(d => (d.id === editingId ? diet : d))
          : [...(old || []), diet]
      );

      toast.success(editingId ? "Diet updated" : "Diet created");
      resetForm();
      setIsOpen(false);
    },
 onError: (error: any) => {
    const apiMessage =
      error?.response?.data?.message || error?.message || null;

    if (apiMessage) {
      toast.error(apiMessage);
    } else {
      toast.error("Something went wrong");
    }
  },
  });

  const deleteMutation = useMutation({
    mutationFn: DietService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diets"] });
      toast.success("Diet deleted");
    },
    onError: () => {
      toast.error("Failed to delete diet");
    },
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    saveMutation.mutate();
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        closeDeleteModal();
      },
    });
  };

  return (
    <div className="space-y-6 dark:text-white max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Diets</h2>
        <Button onClick={openAddModal}>+ Add Diet</Button>
      </div>

      {/* List */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading diets...</p>
      )}

      {!isLoading && diets.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No diets added yet.
        </p>
      )}

      <div className="grid gap-4">
        {diets.map((diet:any) => (
          <Card key={diet.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              {/* Image */}
              <div className="w-full sm:w-24 h-24 rounded overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={getDietImage(diet)}
                  alt={diet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg">{diet.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {diet.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="icon"
                  variant="outline"
                  className="flex justify-center items-center"
                  onClick={() => openEditModal(diet)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  className="flex justify-center items-center"
                  onClick={() => openDeleteModal(diet.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={deleteId !== null}
        onClose={closeDeleteModal}
        className="max-w-md p-6"
      >
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
          Delete Diet
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this diet?
          <br />
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit Diet" : "Add Diet"}
        </h3>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input value={form.slug} disabled />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={e =>
                handleChange("description", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {form.image ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded mx-auto"
                  />
                  <p className="text-sm text-muted-foreground">{form.image.name}</p>
                  <button
                    type="button"
                    onClick={() => handleChange("image", null)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : editingId ? (
                <div className="space-y-2">
                  <img
                    src={getDietImage(diets.find((d:any) => d.id === editingId)!)}
                    alt="Current"
                    className="w-24 h-24 object-cover rounded mx-auto"
                  />
                  <p className="text-sm text-muted-foreground">Current image</p>
                  <label className="cursor-pointer">
                    <p className="text-xs text-blue-500 hover:underline">
                      Click to replace
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e =>
                        handleChange("image", e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <p className="text-sm text-muted-foreground">
                    Click to upload image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e =>
                      handleChange("image", e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddDietPage;