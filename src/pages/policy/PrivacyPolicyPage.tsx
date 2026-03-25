import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUp, ChevronDown, ChevronRight, FileText, Home, List, Loader2 } from "lucide-react";
import { fetchPrivacyPolicy } from "../../lib/legal/fetchPrivacyPolicy";
import { preparePolicyHtml } from "../../lib/legal/preparePolicyHtml";
import { cn } from "../../lib/utils";

function formatUpdatedAt(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: fetchPrivacyPolicy,
    staleTime: 1000 * 60 * 30,
  });

  const prepared = useMemo(() => {
    const html = data?.html ?? "";
    if (!html.trim()) return { html: "", sections: [] as ReturnType<typeof preparePolicyHtml>["sections"] };
    return preparePolicyHtml(html);
  }, [data]);

  const title = data?.meta?.title ?? "Privacy Policy";
  const updatedLabel = formatUpdatedAt(data?.meta?.updated_at);
  const firstSectionId = prepared.sections[0]?.id ?? null;
  const highlightId = activeId ?? firstSectionId;

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  }, []);

  useEffect(() => {
    const sections = prepared.sections;
    if (!sections.length) return;

    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0]?.target?.id;
        if (id) setActiveId(id);
      },
      {
        rootMargin: "-12% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1],
      }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [prepared.sections, prepared.html]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm">Loading privacy policy…</p>
      </div>
    );
  }

  if (isError || !prepared.html.trim()) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center bg-gray-50 dark:bg-black">
        <FileText className="w-10 h-10 text-gray-400" aria-hidden />
        <div className="space-y-2 max-w-md">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Could not load privacy policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : "Something went wrong. Try again or contact support."}
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
          <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" aria-hidden />
            <span className="text-gray-800 dark:text-gray-200 font-medium">{title}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" aria-hidden />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
                {updatedLabel && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated {updatedLabel}</p>
                )}
              </div>
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
                <ChevronDown className={cn("w-4 h-4 transition-transform", tocOpen && "rotate-180")} />
              </button>
              {tocOpen && (
                <nav className="px-4 pb-3 pt-0 space-y-0.5 border-t border-gray-100 dark:border-gray-800">
                  {prepared.sections.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => scrollToId(s.id)}
                      className={cn(
                        "block w-full text-left py-2 text-sm rounded-lg px-2 transition-colors",
                        s.level === 3 && "pl-4",
                        highlightId === s.id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                      )}
                    >
                      {s.label}
                    </button>
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
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollToId(s.id)}
                    className={cn(
                      "block w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors border-l-2 -ml-px",
                      s.level === 3 && "pl-4 text-[13px]",
                      highlightId === s.id
                        ? "border-primary bg-primary/5 text-primary font-semibold"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-900/80"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>
          </>
        )}

        <article
          className={cn(
            "flex-1 min-w-0 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm px-5 sm:px-8 py-8 sm:py-10 max-w-none",
            "[&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:scroll-mt-28 [&_h1]:text-gray-900 dark:[&_h1]:text-gray-100",
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

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
