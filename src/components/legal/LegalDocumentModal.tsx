import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { preparePolicyHtml } from "../../lib/legal/preparePolicyHtml";

type LegalDocumentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Static file name inside `public/` */
  fileName: string;
  fullPagePath: string;
};

export function LegalDocumentModal({
  isOpen,
  onClose,
  title,
  fileName,
  fullPagePath,
}: LegalDocumentModalProps) {
  const [rawHtml, setRawHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const base = import.meta.env.BASE_URL || "/";
        const path = `${base.endsWith("/") ? base : `${base}/`}${fileName}`;
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Could not load ${title.toLowerCase()}.`);
        const html = await res.text();
        if (active) setRawHtml(html);
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Could not load document.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [isOpen, fileName, title]);

  const prepared = useMemo(() => {
    if (!rawHtml.trim()) return { html: "" };
    return { html: preparePolicyHtml(rawHtml).html };
  }, [rawHtml]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="p-6 sm:p-7">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Quick preview before continuing.
        </p>

        <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/70 p-4 max-h-[55vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading document...
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <div
              className="[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-sm [&_p]:text-gray-700 dark:[&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:text-sm [&_li]:text-gray-700 dark:[&_li]:text-gray-300 [&_li]:mb-1 [&_strong]:text-gray-900 dark:[&_strong]:text-gray-100"
              dangerouslySetInnerHTML={{ __html: prepared.html }}
            />
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Close
          </button>
          <Link
            to={fullPagePath}
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90"
          >
            Read full agreement
          </Link>
        </div>
      </div>
    </Modal>
  );
}
