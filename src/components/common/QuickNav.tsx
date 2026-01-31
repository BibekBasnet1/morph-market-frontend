import React, { useEffect, useMemo, useRef, useState } from "react";
import { getRoutesForRoles } from "../../config/routes";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { LucideSearch } from "lucide-react";

const publicExtra = [
  { path: "/", label: "Home" },
  { path: "/marketplace", label: "Browse Marketplace" },
  { path: "/cart", label: "Cart" },
  { path: "/activity-log", label: "Activity Log" },
  { path: "/login", label: "Login" },
  { path: "/register", label: "Register" },
];

const QuickNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { roles } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const routes = useMemo(() => {
    const roleRoutes = getRoutesForRoles(roles || []);
    // map to simple shape and include extras
    const mapped = roleRoutes.map((r) => ({ path: r.path, label: r.label }));
    const merged = [...publicExtra, ...mapped];
    // dedupe by path
    const seen = new Set<string>();
    return merged.filter((r) => {
      if (seen.has(r.path)) return false;
      seen.add(r.path);
      return true;
    });
  }, [roles]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return routes.slice(0, 10);
    return routes.filter((r) => (r.label || r.path).toLowerCase().includes(q)).slice(0, 10);
  }, [query, routes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [open]);

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = results[selectedIndex];
        if (item) handleNavigate(item.path);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selectedIndex]);

  if (typeof window === "undefined") return null;

  return (
    <>
      {/* Small hint button in corner */}
      <div className="fixed right-4 bottom-6 z-50 hidden  sm:block">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 text-sm shadow">
          <LucideSearch className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          <span className="text-xs text-gray-700 dark:text-gray-200">Search (Ctrl+K)</span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 z-[99] flex items-start justify-center p-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-xl mt-24 bg-white dark:bg-gray-900 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-800">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <LucideSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search routes, pages, actions..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400">Esc to close</div>
              </div>
            </div>

            <div className="max-h-64 overflow-auto">
              {results.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No results</div>
              ) : (
                <ul>
                  {results.map((r, idx) => (
                    <li
                      key={r.path}
                      onClick={() => handleNavigate(r.path)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between ${idx === selectedIndex ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{r.label || r.path}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{r.path}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickNav;
