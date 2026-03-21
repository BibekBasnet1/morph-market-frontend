import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { CategoryService } from "../../lib/api/categories";
import { SellerTraitsService, type SellerTrait, type SellerTraitSort } from "../../lib/api/seller/sellerTraits";
import { canDeleteSellerRow, canEditSellerRow, formatDate } from "../../lib/myAttributes/utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
import Select from "../../components/ui/select";
import { Textarea } from "../../components/ui/textArea";
import { Modal } from "../../components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const DELETE_WARNING = "This will remove the trait from all your animals";

function categoryLabel(trait: SellerTrait): string {
  const c = trait.category;
  if (c && typeof c === "object" && "name" in c && c.name) return c.name;
  return "—";
}

function getAxiosMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.message;
    if (typeof msg === "string") return msg;
    if (msg && typeof msg === "object" && "message" in msg) {
      return String((msg as { message: string }).message);
    }
  }
  return "Something went wrong";
}

const TraitsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [sortBy, setSortBy] = useState<SellerTraitSort>("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [addOpen, setAddOpen] = useState(false);
  const [editingTrait, setEditingTrait] = useState<SellerTrait | null>(null);
  const [formCategory, setFormCategory] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<SellerTrait | null>(null);

  const traitFormOpen = addOpen || editingTrait !== null;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (editingTrait) {
      setFormCategory(String(editingTrait.category_id));
      setFormName(editingTrait.name);
      setFormDescription(editingTrait.description ?? "");
    }
  }, [editingTrait]);

  useEffect(() => {
    if (addOpen && !editingTrait) {
      setFormCategory("");
      setFormName("");
      setFormDescription("");
    }
  }, [addOpen, editingTrait]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "seller-traits"],
    queryFn: () => CategoryService.getAll(),
  });

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...categories.map((c) => ({
      value: String(c.id),
      label: c.name,
    })),
  ];

  const formCategoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const { data, isLoading } = useQuery({
    queryKey: [
      "seller-traits",
      page,
      debouncedSearch,
      categoryId,
      sortBy,
      order,
    ],
    queryFn: () =>
      SellerTraitsService.list({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        category_id: categoryId ? Number(categoryId) : undefined,
        sort_by: sortBy,
        order,
      }),
  });

  const traits = data?.items ?? [];
  const meta = data?.meta;

  const createMutation = useMutation({
    mutationFn: () =>
      SellerTraitsService.create({
        category_id: Number(formCategory),
        name: formName.trim(),
        description: formDescription.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-traits"] });
      toast.success("Trait created");
      setAddOpen(false);
      setFormCategory("");
      setFormName("");
      setFormDescription("");
    },
    onError: (err) => toast.error(getAxiosMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingTrait) throw new Error("No trait");
      return SellerTraitsService.update(editingTrait.id, {
        category_id: Number(formCategory),
        name: formName.trim(),
        description: formDescription.trim() ? formDescription.trim() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-traits"] });
      toast.success("Trait updated");
      setEditingTrait(null);
      setFormCategory("");
      setFormName("");
      setFormDescription("");
    },
    onError: (err) => toast.error(getAxiosMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => SellerTraitsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-traits"] });
      toast.success("Trait deleted");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(getAxiosMessage(err)),
  });

  const traitFormBusy = createMutation.isPending || updateMutation.isPending;

  const handleTraitFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory) {
      toast.error("Select a category");
      return;
    }
    if (!formName.trim()) {
      toast.error("Enter a name");
      return;
    }
    if (editingTrait) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const closeTraitForm = () => {
    if (traitFormBusy) return;
    setAddOpen(false);
    setEditingTrait(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 flex-wrap">
              <div className="min-w-[180px] flex-1">
                <Label htmlFor="trait-search">Search</Label>
                <Input
                  id="trait-search"
                  placeholder="Search by name…"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="min-w-[200px]">
                <Label>Category</Label>
                <Select
                  options={categoryOptions}
                  value={categoryId}
                  onChange={(v) => {
                    setCategoryId(v);
                    setPage(1);
                  }}
                  placeholder="All categories"
                />
              </div>
              <div className="min-w-[160px]">
                <Label>Sort by</Label>
                <Select
                  options={[
                    { value: "created_at", label: "Created date" },
                    { value: "name", label: "Name" },
                    { value: "category_id", label: "Category" },
                  ]}
                  value={sortBy}
                  onChange={(v) => {
                    setSortBy(v as SellerTraitSort);
                    setPage(1);
                  }}
                />
              </div>
              <div className="min-w-[120px]">
                <Label>Order</Label>
                <Select
                  options={[
                    { value: "desc", label: "Descending" },
                    { value: "asc", label: "Ascending" },
                  ]}
                  value={order}
                  onChange={(v) => {
                    setOrder(v as "asc" | "desc");
                    setPage(1);
                  }}
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={() => {
                setEditingTrait(null);
                setAddOpen(true);
              }}
              className="bg-[#22c55e] hover:bg-[#16a34a] dark:bg-[#22c55e]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add trait
            </Button>
          </div>

          {isLoading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading traits…</p>
          )}

          {!isLoading && traits.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              No traits yet. Add one to use it on your animals.
            </p>
          )}

          {!isLoading && traits.length > 0 && (
            <>
              <div className="grid gap-3 md:hidden">
                {traits.map((trait) => (
                  <Card
                    key={trait.id}
                    className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug min-w-0">
                          {trait.name}
                        </h3>
                        <div className="flex shrink-0 items-center gap-0.5">
                          {canEditSellerRow(trait) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-[#16a34a] hover:bg-green-50 dark:hover:bg-green-950/30"
                              onClick={() => {
                                setAddOpen(false);
                                setEditingTrait(trait);
                              }}
                              aria-label={`Edit ${trait.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDeleteSellerRow(trait) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => setDeleteTarget(trait)}
                              aria-label={`Delete ${trait.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {!canEditSellerRow(trait) && !canDeleteSellerRow(trait) && (
                            <span className="text-xs text-gray-400 px-2">—</span>
                          )}
                        </div>
                      </div>
                      <dl className="space-y-2 text-sm">
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                          <dd className="text-gray-900 dark:text-gray-100 break-words">
                            {categoryLabel(trait)}
                          </dd>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <dt className="text-gray-500 dark:text-gray-400">Description</dt>
                          <dd className="text-gray-700 dark:text-gray-300 break-words">
                            {trait.description?.trim() || "—"}
                          </dd>
                        </div>
                        <div className="flex flex-col gap-0.5 pt-1 border-t border-gray-100 dark:border-gray-800">
                          <dt className="text-gray-500 dark:text-gray-400">Created</dt>
                          <dd className="text-gray-600 dark:text-gray-400 text-sm">
                            {formatDate(trait.created_at)}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="hidden md:block rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Trait name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created at</TableHead>
                      <TableHead className="w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {traits.map((trait) => (
                      <TableRow key={trait.id}>
                        <TableCell className="font-medium">{trait.name}</TableCell>
                        <TableCell>{categoryLabel(trait)}</TableCell>
                        <TableCell className="max-w-[240px] truncate text-gray-600 dark:text-gray-400">
                          {trait.description?.trim() || "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-gray-600 dark:text-gray-400">
                          {formatDate(trait.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {canEditSellerRow(trait) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-[#16a34a] hover:bg-green-50 dark:hover:bg-green-950/30"
                                onClick={() => {
                                  setAddOpen(false);
                                  setEditingTrait(trait);
                                }}
                                aria-label={`Edit ${trait.name}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {canDeleteSellerRow(trait) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                onClick={() => setDeleteTarget(trait)}
                                aria-label={`Delete ${trait.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            {!canEditSellerRow(trait) && !canDeleteSellerRow(trait) && (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between gap-2 pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {meta.current_page} of {meta.last_page}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={traitFormOpen} onClose={closeTraitForm}>
        <div className="p-6 sm:p-8 pr-14 sm:pr-16">
          <h2 className="text-lg font-semibold mb-1 pr-2">
            {editingTrait ? "Edit trait" : "Add custom trait"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Traits must belong to an admin category. Names must be unique per category.
          </p>
          <form onSubmit={handleTraitFormSubmit} className="space-y-4">
            <div>
              <Label>Category</Label>
              <Select
                options={formCategoryOptions}
                value={formCategory}
                onChange={setFormCategory}
                placeholder="Select category"
              />
            </div>
            <div>
              <Label htmlFor="trait-name">Name</Label>
              <Input
                id="trait-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Albino"
                required
              />
            </div>
            <div>
              <Label htmlFor="trait-desc">Description (optional)</Label>
              <Textarea
                id="trait-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Short note for your reference"
                className="dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeTraitForm}
                disabled={traitFormBusy}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={traitFormBusy}
                className="bg-[#22c55e] hover:bg-[#16a34a]"
              >
                {traitFormBusy
                  ? "Saving…"
                  : editingTrait
                    ? "Save changes"
                    : "Create trait"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
      >
        <div className="p-6 sm:p-8 pr-14 sm:pr-16">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2 pr-2">
            Delete trait?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{DELETE_WARNING}</p>
          {deleteTarget && (
            <p className="text-sm font-medium mb-6">
              <span className="text-gray-500 dark:text-gray-400">Trait: </span>
              {deleteTarget.name}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TraitsPage;
