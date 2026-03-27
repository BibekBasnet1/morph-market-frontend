import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ChevronDown, FileText, Home, List, Loader2 } from "lucide-react";
import { preparePolicyHtml } from "../../lib/legal/preparePolicyHtml";
import { cn } from "../../lib/utils";

async function fetchWaiverHtml(): Promise<string> {
  const base = import.meta.env.BASE_URL || "/";
  const path = `${base.endsWith("/") ? base : `${base}/`}animal-transaction-liability-waiver.html`;
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("Could not load animal liability waiver file.");
  }
  return res.text();
}

export default function AnimalLiabilityWaiverPage() {
  const [tocOpen, setTocOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["animal-liability-waiver-static"],
    queryFn: fetchWaiverHtml,
    staleTime: 1000 * 60 * 30,
  });

  const prepared = useMemo(() => {
    const html = data ?? "";
    if (!html.trim()) {
      return {
        html: "",
        sections: [] as ReturnType<typeof preparePolicyHtml>["sections"],
      };
    }
    return preparePolicyHtml(html);
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm">Loading liability waiver...</p>
      </div>
    );
  }

  if (isError || !prepared.html.trim()) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center bg-gray-50 dark:bg-black">
        <FileText className="w-10 h-10 text-gray-400" aria-hidden />
        <div className="space-y-2 max-w-md">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Could not load liability waiver
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : "Something went wrong. Try again."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90"
          >
            Retry
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Animal Transaction Liability Waiver</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {prepared.sections.length > 0 && (
          <>
            <div className="lg:hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setTocOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                <span className="inline-flex items-center gap-2">
                  <List className="w-4 h-4 text-primary" />
                  On this page
                </span>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", tocOpen && "rotate-180")}
                />
              </button>
              {tocOpen && (
                <nav className="px-4 pb-3 pt-0 space-y-0.5 border-t border-gray-100 dark:border-gray-800">
                  {prepared.sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className={cn(
                        "block w-full text-left py-2 text-sm rounded-lg px-2 transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/80",
                        s.level === 3 && "pl-4"
                      )}
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              )}
            </div>

            <aside className="hidden lg:block w-64 shrink-0">
              <nav
                className="sticky top-24 space-y-1 pr-2 border-r border-gray-200 dark:border-gray-800"
                aria-label="Page sections"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 pb-2">
                  On this page
                </p>
                {prepared.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={cn(
                      "block w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors border-l-2 -ml-px border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-900/80",
                      s.level === 3 && "pl-4 text-[13px]"
                    )}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </aside>
          </>
        )}

        <article
          className={cn(
            "flex-1 min-w-0 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm px-5 sm:px-8 py-8 sm:py-10 max-w-none",
            "[&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:text-gray-900 dark:[&_h1]:text-gray-100",
            "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-28 [&_h2]:text-gray-900 dark:[&_h2]:text-gray-100",
            "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:scroll-mt-28 [&_h3]:text-gray-900 dark:[&_h3]:text-gray-100",
            "[&_p]:text-gray-600 dark:[&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-4",
            "[&_ul]:text-gray-600 dark:[&_ul]:text-gray-300 [&_ul]:mb-4 [&_ul]:pl-5",
            "[&_ol]:text-gray-600 dark:[&_ol]:text-gray-300 [&_ol]:mb-4 [&_ol]:pl-5",
            "[&_li]:mb-1",
            "[&_a]:text-primary [&_a]:font-medium [&_a]:underline underline-offset-2",
            "[&_strong]:text-gray-900 dark:[&_strong]:text-gray-100"
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: prepared.html }} />
        </article>
      </div>
    </div>
  );
}
