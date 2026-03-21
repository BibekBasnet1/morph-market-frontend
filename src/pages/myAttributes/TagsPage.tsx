import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { SellerTagsService, type SellerTag } from "../../lib/api/seller/sellerTags";
import { canDeleteSellerRow, canEditSellerRow, formatDate, slugifyFromName } from "../../lib/myAttributes/utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
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

const TagsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<SellerTag | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<SellerTag | null>(null);

  const tagFormOpen = addOpen || editingTag !== null;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const slugPreview = slugifyFromName(formName);

  useEffect(() => {
    if (editingTag) {
      setFormName(editingTag.name);
      setFormSlug(editingTag.slug);
    }
  }, [editingTag]);

  useEffect(() => {
    if (addOpen && !editingTag) {
      setFormName("");
      setFormSlug("");
    }
  }, [addOpen, editingTag]);

  const { data, isLoading } = useQuery({
    queryKey: ["seller-tags", page, debouncedSearch],
    queryFn: () =>
      SellerTagsService.list({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        sort_by: "created_at",
        order: "desc",
      }),
  });

  const tags = data?.items ?? [];
  const meta = data?.meta;

  const createMutation = useMutation({
    mutationFn: () => {
      const name = formName.trim();
      const body: { name: string; slug?: string } = { name };
      const slug = slugifyFromName(name);
      if (slug) body.slug = slug;
      return SellerTagsService.create(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-tags"] });
      toast.success("Tag created");
      setAddOpen(false);
      setFormName("");
      setFormSlug("");
    },
    onError: (err) => toast.error(getAxiosMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingTag) throw new Error("No tag");
      const name = formName.trim();
      const rawSlug = formSlug.trim();
      const slug = rawSlug || slugifyFromName(name);
      return SellerTagsService.update(editingTag.id, { name, slug });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-tags"] });
      toast.success("Tag updated");
      setEditingTag(null);
      setFormName("");
      setFormSlug("");
    },
    onError: (err) => toast.error(getAxiosMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => SellerTagsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-tags"] });
      toast.success("Tag deleted");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(getAxiosMessage(err)),
  });

  const tagFormBusy = createMutation.isPending || updateMutation.isPending;

  const handleTagFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Enter a name");
      return;
    }
    if (editingTag) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const closeTagForm = () => {
    if (tagFormBusy) return;
    setAddOpen(false);
    setEditingTag(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-[200px] flex-1 max-w-md">
              <Label htmlFor="tag-search">Search</Label>
              <Input
                id="tag-search"
                placeholder="Search tags…"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button
              type="button"
              onClick={() => {
                setEditingTag(null);
                setAddOpen(true);
              }}
              className="bg-[#22c55e] hover:bg-[#16a34a] dark:bg-[#22c55e]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add tag
            </Button>
          </div>

          {isLoading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading tags…</p>
          )}

          {!isLoading && tags.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              No tags yet. Create a tag to label your animals.
            </p>
          )}

          {!isLoading && tags.length > 0 && (
            <>
              <div className="grid gap-3 md:hidden">
                {tags.map((tag) => (
                  <Card
                    key={tag.id}
                    className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug min-w-0">
                          {tag.name}
                        </h3>
                        <div className="flex shrink-0 items-center gap-0.5">
                          {canEditSellerRow(tag) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-[#16a34a] hover:bg-green-50 dark:hover:bg-green-950/30"
                              onClick={() => {
                                setAddOpen(false);
                                setEditingTag(tag);
                              }}
                              aria-label={`Edit ${tag.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDeleteSellerRow(tag) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => setDeleteTarget(tag)}
                              aria-label={`Delete ${tag.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {!canEditSellerRow(tag) && !canDeleteSellerRow(tag) && (
                            <span className="text-xs text-gray-400 px-2">—</span>
                          )}
                        </div>
                      </div>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-gray-500 dark:text-gray-400 mb-0.5">Slug</dt>
                          <dd className="font-mono text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-all">
                            {tag.slug}
                          </dd>
                        </div>
                        <div className="flex flex-col gap-0.5 pt-1 border-t border-gray-100 dark:border-gray-800">
                          <dt className="text-gray-500 dark:text-gray-400">Created</dt>
                          <dd className="text-gray-600 dark:text-gray-400">
                            {formatDate(tag.created_at)}
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
                      <TableHead>Tag name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Created at</TableHead>
                      <TableHead className="w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                          {tag.slug}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-gray-600 dark:text-gray-400">
                          {formatDate(tag.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {canEditSellerRow(tag) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-[#16a34a] hover:bg-green-50 dark:hover:bg-green-950/30"
                                onClick={() => {
                                  setAddOpen(false);
                                  setEditingTag(tag);
                                }}
                                aria-label={`Edit ${tag.name}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {canDeleteSellerRow(tag) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                onClick={() => setDeleteTarget(tag)}
                                aria-label={`Delete ${tag.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            {!canEditSellerRow(tag) && !canDeleteSellerRow(tag) && (
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

      <Modal isOpen={tagFormOpen} onClose={closeTagForm}>
        <div className="p-6 sm:p-8 pr-14 sm:pr-16">
          <h2 className="text-lg font-semibold mb-1 pr-2">
            {editingTag ? "Edit tag" : "Add tag"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {editingTag
              ? "Update the display name and URL slug. Changing the slug may affect existing links."
              : "Tags are free-form. The URL slug is generated from the name."}
          </p>
          <form onSubmit={handleTagFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tag-name">Name</Label>
              <Input
                id="tag-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Captive Bred"
                required
              />
              {!editingTag && slugPreview ? (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Slug preview:{" "}
                  <span className="font-mono text-gray-700 dark:text-gray-300">{slugPreview}</span>
                </p>
              ) : null}
            </div>
            {editingTag && (
              <div>
                <Label htmlFor="tag-slug">Slug</Label>
                <Input
                  id="tag-slug"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="url-friendly-slug"
                  className="font-mono text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Leave blank to derive from the name.
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeTagForm}
                disabled={tagFormBusy}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={tagFormBusy}
                className="bg-[#22c55e] hover:bg-[#16a34a]"
              >
                {tagFormBusy
                  ? "Saving…"
                  : editingTag
                    ? "Save changes"
                    : "Create tag"}
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
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2 pr-2">Delete tag?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{DELETE_WARNING}</p>
          {deleteTarget && (
            <p className="text-sm font-medium mb-6">
              <span className="text-gray-500 dark:text-gray-400">Tag: </span>
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

export default TagsPage;
