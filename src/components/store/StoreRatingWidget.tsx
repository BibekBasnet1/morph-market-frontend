import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { StoreService } from "../../lib/api/stores";
import { cn } from "../../lib/utils";

const storageKey = (userId: number, storeId: string) => `store-user-rating:${userId}:${storeId}`;

function readStoredRating(userId: number, storeId: string | undefined): number | null {
  if (!storeId || typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(storageKey(userId, storeId));
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return n >= 1 && n <= 5 ? n : null;
}

function writeStoredRating(userId: number, storeId: string, rating: number) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  sessionStorage.setItem(storageKey(userId, storeId), String(clamped));
}

type Props = {
  storeId: string | undefined;
  /** Logged-in user's existing rating for this store, if API returns it on the store payload (e.g. `user_rating`). */
  initialUserRating?: number | null;
  /** Store owner's user id — used to block self-rating. */
  ownerUserId?: number | null;
  className?: string;
};

export function StoreRatingWidget({
  storeId,
  initialUserRating,
  ownerUserId,
  className,
}: Props) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [hover, setHover] = useState<number | null>(null);
  /** Set after a successful submit so the UI updates immediately; otherwise uses `initialUserRating` from the API. */
  const [lastSubmitted, setLastSubmitted] = useState<number | null>(null);

  const fromApi =
    initialUserRating != null && initialUserRating > 0 ? Math.round(initialUserRating) : null;
  const fromSession =
    user && storeId ? readStoredRating(user.id, storeId) : null;
  const submittedRating = lastSubmitted ?? fromApi ?? fromSession;

  const displayHover = hover ?? submittedRating;

  const mutation = useMutation({
    mutationFn: (rating: number) => StoreService.submitStoreRating(storeId!, rating),
    onSuccess: (data, rating) => {
      const next = data.user_rating ?? rating;
      const clamped = Math.min(5, Math.max(1, Math.round(next)));
      setLastSubmitted(clamped);
      if (user) writeStoredRating(user.id, storeId!, clamped);
      toast.success(data.message ?? "Thanks for rating this store!");
      queryClient.invalidateQueries({ queryKey: ["store-products", storeId] });
    },
    onError: (err: unknown) => {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String((err.response.data as { message: unknown }).message)
          : "Could not save your rating. Try again.";
      toast.error(msg);
    },
  });

  if (!storeId) return null;

  const ownsStore =
    Boolean(user) &&
    ((ownerUserId != null && user != null && Number(ownerUserId) === user.id) ||
      Boolean(user?.stores?.some((s) => String(s.id) === String(storeId))));

  if (ownsStore) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-500 dark:text-gray-400",
          className
        )}
      >
        You cannot rate your own store.
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-sm",
          className
        )}
      >
        <p className="text-gray-600 dark:text-gray-300 mb-2">Rate this store</p>
        <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
          Sign in to leave a rating
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm",
        className
      )}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
        Rate this store
      </p>
      <div className="flex items-center gap-1" role="group" aria-label="Rate from 1 to 5 stars">
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = displayHover != null && value <= displayHover;
          return (
            <button
              key={value}
              type="button"
              disabled={mutation.isPending}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
              onClick={() => mutation.mutate(value)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
            >
              <Star
                className={cn(
                  "w-7 h-7 transition-colors",
                  filled ? "fill-amber-500 stroke-amber-500" : "fill-none stroke-gray-300 dark:stroke-gray-600"
                )}
              />
            </button>
          );
        })}
      </div>
      {submittedRating != null && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          You rated {submittedRating} out of 5.
          <span className="block mt-1 text-[11px] opacity-90">Tap a star to change your rating.</span>
        </p>
      )}
    </div>
  );
}
