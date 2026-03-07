
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StoreService } from "../../lib/api/stores";
import {
  Star,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  Package,
  Truck,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";



// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAYS_ORDER = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

function formatTime(value?: string) {
  if (!value) return "";
  // If ISO timestamp, format to HH:MM (24h)
  if (value.includes("T")) {
    // Parse as UTC and display UTC hours:minutes to avoid local timezone shifts
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  // If already in HH:MM or HH:MM:SS format, return first 5 chars
  const match = value.match(/^(\d{1,2}:\d{2})/);
  if (match) return match[1].padStart(5, "0");
  // Fallback: try parsing as date
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return value;
}

function getTodayStatus(hours: any[] = []) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const todayHours = hours.find(h => h.day === today);
  if (!todayHours || !todayHours.is_open) return { open: false, label: "Closed today" };
  return { open: true, label: `Open today · ${formatTime(todayHours.open_time)} – ${formatTime(todayHours.close_time)}` };
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star
          key={n}
          width={size} height={size}
          fill={n <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke={n <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

function ShippingBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    international: { label: "🌍 International", color: "#1a4a32", bg: "#e6f4ea" },
    national:      { label: "🇺🇸 National",      color: "#1e3a8a", bg: "#eff6ff" },
    regional:      { label: "📍 Regional",       color: "#713f12", bg: "#fef9c3" },
    local_pickup:  { label: "🏠 Local Pickup",   color: "#4b1d96", bg: "#f5f3ff" },
  };
  const info = map[type] ?? { label: type, color: "#374151", bg: "#f3f4f6" };
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color: info.color, background: info.bg }}
    >
      {info.label}
    </span>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProductCard({ product, onClick }: { product: { id: number; name: string; price: number | string; image?: string | null; available?: boolean }; onClick?: () => void }) {
  const [liked, setLiked] = useState(false);
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden group cursor-pointer"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
    >
      <div
        className="h-36 relative overflow-hidden"
        style={{
          background: product.image
            ? undefined
            : "linear-gradient(135deg, #c8d8c8 0%, #e8f0e8 100%)",
        }}
      >
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded-full">Sold Out</span>
          </div>
        )}
        <button
          onClick={() => setLiked(l => !l)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <Heart
            className="w-3.5 h-3.5 transition-colors"
            fill={liked ? "#ef4444" : "none"}
            stroke={liked ? "#ef4444" : "#6b7280"}
          />
        </button>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-800 leading-snug mb-1">{product.name}</p>
        <p className="text-base font-bold text-primary">${product.price}</p>
      </div>
    </div>
  );
}

// function ReviewCard({ review }: { review: { id: number; author: string; rating: number; date: string; comment: string } }) {
//   return (
//     <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
//       <div className="flex items-start justify-between mb-2">
//         <div>
//           <p className="text-sm font-semibold text-gray-800">{review.author}</p>
//           <p className="text-xs text-gray-400">{review.date}</p>
//         </div>
//         <StarRow rating={review.rating} size={12} />
//       </div>
//       <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
//     </div>
//   );
// }

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StoreDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"listings" | "about">("listings");

  const { data: storeData, isLoading } = useQuery<any>({
    queryKey: ["store-products", id],
    queryFn: () => StoreService.getStoresById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading store...</div>
    );
  }

  const store = storeData ?? {};
  const todayStatus = getTodayStatus(store.store_hours || []);

  const inventoryCount = (store.inventories || []).length;
  const tabs = [
    { key: "listings", label: `Listings (${inventoryCount})` },
    // { key: "reviews",  label: `Reviews (${store.total_reviews ?? 0})` },
    { key: "about",    label: "About & Policy" },
  ] as const;

  return (
    <div className="min-h-screen text-foreground">
      {/* Back nav */}
      <div className="mx-auto px-4 sm:px-6">
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden h-32 sm:h-44 md:h-52"
        >
          {store.image_urls?.cover_photo?.url ? (
            <img src={store.image_urls.cover_photo.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full bg-primary"
              style={{ background: "linear-gradient(135deg, #259353 0%, #1f6e49 100%)" }}
            />
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
            aria-hidden
          />

          {/* Action buttons top-right */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile section */}
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3 sm:gap-4 -mt-8 sm:-mt-10 mb-4 sm:mb-6 relative z-10">
          {/* Logo */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-4 border-white flex items-center justify-center flex-shrink-0 bg-primary shadow-lg"
          >
            {store.image_urls?.logo?.url ? (
              <img src={store.image_urls.logo.url} alt={store.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-white text-3xl font-bold">{store.name.charAt(0)}</span>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {store.name}
              </h1>
              {store.is_verified && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
              <ShippingBadge type={store.shipping_type} />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-sm">
              <div className="flex items-center gap-1.5">
                <StarRow rating={Number(store.rating) || 0} size={13} />
                <span className="text-sm font-semibold text-gray-700">{(Number(store.rating) || 0).toFixed(2)}</span>
                <span className="text-xs text-gray-400">({store.total_reviews ?? store.review_count ?? 0} reviews)</span>
              </div>
              <span className="text-gray-300">·</span>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${todayStatus.open ? "text-emerald-600" : "text-red-500"}`}
              >
                {todayStatus.open ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {todayStatus.label}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                {inventoryCount} items available
              </span>
            </div>
          </div>

          {/* CTA */}
          {/* <div className="flex gap-2 flex-shrink-0" style={{ fontFamily: "sans-serif" }}>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ background: "#1a6b3a", boxShadow: "0 2px 8px rgba(26,107,58,0.3)" }}
            >
              <Package className="w-4 h-4" />
              View All Listings
            </button>
          </div> */}
        </div>

        {/* Main layout — single column on mobile, sidebar below listings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pb-12 sm:pb-16">

          {/* Left column — tabs content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/60 backdrop-blur-md">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Listings */}
            {activeTab === "listings" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {(store.inventories || []).map((inv: any) => {
                  const prod = inv.product || {};
                  const card = {
                    id: prod.id ?? inv.inventory_id,
                    name: prod.name ?? prod.title ?? "",
                    price: inv.price ?? inv.sale_price ?? prod.price ?? 0,
                    image: prod.image_urls?.thumbnail?.url || prod.image || null,
                    available: Boolean(inv.active),
                  };
                  return <ProductCard key={card.id} product={card} onClick={() => prod.slug && navigate(`/product/${prod.slug}`)} />;
                })}
              </div>
            )}

            {/* Reviews */}
            {/* {activeTab === "reviews" && (
              <div className="space-y-3">
                <div
                  className="bg-white rounded-2xl p-5 flex items-center gap-6"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", fontFamily: "sans-serif" }}
                >
                  <div className="text-center">
                      <p className="text-5xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}>
                        {Number(store.rating) || 0}
                      </p>
                      <StarRow rating={Number(store.rating) || 0} size={16} />
                      <p className="text-xs text-gray-400 mt-1">{store.total_reviews ?? 0} reviews</p>
                    </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(n => (
                      <div key={n} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-2">{n}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: n === 5 ? "78%" : n === 4 ? "14%" : n === 3 ? "5%" : "2%",
                              background: "#1a6b3a",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {(store.reviews || []).map((r: any) => <ReviewCard key={r.id} review={r} />)}
              </div>
            )} */}

            {/* About */}
            {activeTab === "about" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">About the Store</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{store.about}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Store Policy</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{store.policy}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-4">

            {/* Contact */}
            {store.contact_visible && (
              <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</h3>
                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {store.phone}
                  </a>
                )}
                {store.email && (
                  <a
                    href={`mailto:${store.email}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-primary transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {store.email}
                  </a>
                )}
              </div>
            )}

            {/* Address */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Location</h3>
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                {store.address ? (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {store.address.address_line_1}
                    {store.address.address_line_2 && `, ${store.address.address_line_2}`}
                    <br />
                    {store.address.city}, {store.address.state} {store.address.zip_code}
                    <br />
                    {store.address.country}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">Address not provided</p>
                )}
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Hours</h3>
                <Clock className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="space-y-1.5">
                {DAYS_ORDER.map(day => {
                  const hour = (store.store_hours || []).find((h: any) => h.day === day);
                  const isToday = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === day;
                  return (
                    <div
                      key={day}
                      className={`flex justify-between items-center text-xs py-0.5 rounded-md px-1 -mx-1 ${isToday ? "bg-primary/5 font-semibold" : ""}`}
                    >
                      <span className="text-gray-600 capitalize">{day}</span>
                            {hour?.is_open ? (
                              <span className="text-primary">
                                {formatTime(hour.open_time)} – {formatTime(hour.close_time)}
                              </span>
                            ) : (
                              <span className="text-gray-400">Closed</span>
                            )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping</h3>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
                  <Truck className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <ShippingBadge type={store.shipping_type} />
                  <p className="text-xs text-gray-400 mt-1">Live arrival guaranteed</p>
                </div>
              </div>
            </div>

            {/* Owner */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 bg-primary">
                {(store.owner?.name || store.owner?.username || "").charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{store.owner?.name ?? store.owner?.username ?? "Store Owner"}</p>
                <p className="text-xs text-gray-400">Store owner · Member since {store.owner?.joined ?? (store.owner?.created_at ? new Date(store.owner.created_at).getFullYear() : "—")}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}