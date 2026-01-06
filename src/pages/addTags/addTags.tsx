import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textArea";
import { Trash2, Edit } from "lucide-react";

import type { Tag } from "../../types";
import { TagsService } from "../../lib/api/attributes/tags";
import { slugify } from "../../lib/slugify";
import { Modal } from "../../components/ui/modal";

const AddTagsPage = () => {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    // image: null as File | null,
  });

  const openAddModal = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditModal = (tag: Tag) => {
    setEditingId(tag.id);
    setForm({
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      // image: null,
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
    setForm({ name: "", description: "", slug: ""});
    setEditingId(null);
  };

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: TagsService.getAll,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      // if (form.image) formData.append("image", form.image);

      if (editingId) {
        const updated = await TagsService.update(editingId, formData);
        return updated;
      } else {
        const created = await TagsService.create(formData);
        return created;
      }
    },
    onSuccess: (tag: Tag) => {
      queryClient.setQueryData<Tag[]>(["tags"], old =>
        editingId
          ? old!.map(t => (t.id === editingId ? tag : t))
          : [...(old || []), tag]
      );

      toast.success(editingId ? "Tag updated" : "Tag created");
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
    mutationFn: TagsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag deleted");
    },
    onError: () => {
      toast.error("Failed to delete tag");
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
        <h2 className="text-xl font-semibold">Tags</h2>
        <Button onClick={openAddModal}>+ Add Tag</Button>
      </div>

      {/* List */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading tags...</p>
      )}

      {!isLoading && tags.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No tags added yet.
        </p>
      )}

      <div className="grid gap-4">
        {tags.map(tag => (
          <Card key={tag.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{tag.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {tag.description}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="flex justify-center items-center"
                  onClick={() => openEditModal(tag)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  className="flex justify-center items-center"
                  onClick={() => openDeleteModal(tag.id)}
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
          Delete Tag
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this tag?
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
          {editingId ? "Edit Tag" : "Add Tag"}
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

          {/* <div>
            <Label>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={e =>
                handleChange("image", e.target.files?.[0] || null)
              }
            />
          </div> */}

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

export default AddTagsPage;