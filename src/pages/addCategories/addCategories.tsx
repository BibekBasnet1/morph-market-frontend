import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textArea";
import { Trash2, Edit } from "lucide-react";

import type { Category } from "../../types";
import { CategoryService } from "../../lib/api/categories";
import { slugify } from "../../lib/slugify";
import { Modal } from "../../components/ui/modal";

const AddCategoriesPage = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: null as File | null,
    preview: "" as string
  });

  const openAddModal = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: null,
      preview: (typeof category.image === 'string' ? category.image : "") || ""
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

  // const resetForm = () => {
  //   setForm({ name: "", description: "", slug: "" });
  //   setEditingId(null);
  // };
  const resetForm = () => {
    try {
      if (form.preview && form.preview.startsWith("blob:")) {
        URL.revokeObjectURL(form.preview);
      }
    } catch (e) {
      // ignore
    }
    setForm({ name: "", description: "", slug: "", image: null, preview: "" });
    setEditingId(null);
  };

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],

    queryFn: CategoryService.getAllPublic,
  });



  const saveMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      if (editingId) {
        const updated = await CategoryService.update(editingId, formData);
        return updated; // return the updated category
      } else {
        const created = await CategoryService.create(formData);
        return created; // return the new category
      }
    },
    onSuccess: (category: Category) => {
      // Update cache manually to avoid extra fetch
      queryClient.setQueryData<Category[]>(["categories"], old =>
        editingId
          ? old!.map(cat => (cat.id === editingId ? category : cat))
          : [...(old || []), category]
      );

      toast.success(editingId ? "Category updated" : "Category created");
      resetForm();
      setIsOpen(false); // close the modal
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });


  const deleteMutation = useMutation({
    mutationFn: CategoryService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: () => {
      toast.error("Failed to delete category");
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
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={openAddModal}>+ Add Category</Button>
      </div>

      {/* List */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading categories...</p>
      )}

      {!isLoading && categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No categories added yet.
        </p>
      )}

      <div className="grid gap-4">
        {categories.map(category => (
          <Card key={category.id}>
            <CardContent className="p-4 flex items-start justify-between">
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="flex justify-center items-center"
                  onClick={() => openEditModal(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  className="flex justify-center items-center"
                  onClick={() => openDeleteModal(category.id)}
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
          Delete Category
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this category?
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
          {editingId ? "Edit Category" : "Add Category"}
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
            <Input type="file" accept="image/*" onChange={e => handleChange("image", e.target.files?.[0] || null)} />
            {form.preview && (
              <img src={form.preview}
                alt="preview"
                className="mt-3 w-32 h-32 object-cover rounded" />
            )}
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

export default AddCategoriesPage;
