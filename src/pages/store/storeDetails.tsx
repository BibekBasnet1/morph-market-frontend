// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { StoreService } from "../../lib/api/stores";


// export default function StoreDetails() {
//   const { id } = useParams();

//   const { data: products = [], isLoading } = useQuery({
//     queryKey: ["store-products", id],
//     queryFn: () => StoreService.getStoresById(id),
//     enabled: !!id,
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading store...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#f3f6f4] to-[#dfe8df] px-6 py-10">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8">
//         <h2 className="text-2xl font-bold mb-6">Store Products</h2>

//         {products.length === 0 ? (
//           <p className="text-gray-500">No products found.</p>
//         ) : (
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
//             {products.map((product: any) => (
//               <div
//                 key={product.id}
//                 className="border rounded-xl p-4 hover:shadow-md transition"
//               >
//                 <h3 className="font-semibold">{product.name}</h3>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Rs. {product.price}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import {
  Star,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Truck,
  MessageCircle,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_STORE = {
  id: 2,
  name: "Desert Dwellers",
  brand_name: "Desert Dwellers",
  slug: "desert-dwellers",
  is_verified: true,
  is_active: true,
  rating: 4.9,
  review_count: 243,
  inventory_count: 12,
  about:
    "Desert Dwellers has been connecting reptile enthusiasts with the world's most exotic and ethically sourced species since 2014. Our commitment to responsible breeding and animal welfare sets us apart. Every animal in our care is raised with respect, proper nutrition, and expert veterinary support.",
  policy:
    "All sales are final. Live arrival guaranteed on overnight shipments. We ship Monday–Wednesday to avoid weekend delays. Full refund or replacement issued if animal arrives deceased with photo proof within 2 hours of delivery.",
  shipping_type: "international",
  contact_visible: true,
  phone: "+1 (520) 847-2901",
  email: "hello@desertdwellers.com",
  cover_photo: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&q=80",
  logo: null,
  address: {
    address_line_1: "4421 Saguaro Trail",
    address_line_2: "Suite 7",
    city: "Tucson",
    zip_code: "85701",
    state: "Arizona",
    country: "United States",
  },
  store_hours: [
    { day: "monday", open_time: "09:00", close_time: "18:00", is_open: true },
    { day: "tuesday", open_time: "09:00", close_time: "18:00", is_open: true },
    { day: "wednesday", open_time: "09:00", close_time: "18:00", is_open: true },
    { day: "thursday", open_time: "09:00", close_time: "18:00", is_open: true },
    { day: "friday", open_time: "09:00", close_time: "17:00", is_open: true },
    { day: "saturday", open_time: "10:00", close_time: "15:00", is_open: true },
    { day: "sunday", open_time: "09:00", close_time: "18:00", is_open: false },
  ],
  owner: {
    name: "Marcus Webb",
    joined: "2014",
    avatar: null,
  },
};

const MOCK_PRODUCTS = [
  { id: 1, name: "Ball Python - Pastel", price: 249, image: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=300&q=80", available: true },
  { id: 2, name: "Bearded Dragon Juvenile", price: 129, image: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=300&q=80", available: true },
  { id: 3, name: "Crested Gecko", price: 89, image: "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=300&q=80", available: true },
  { id: 4, name: "Blue-tongued Skink", price: 399, image: null, available: false },
  { id: 5, name: "Leopard Gecko – Eclipse", price: 175, image: null, available: true },
  { id: 6, name: "Red-eyed Treefrog", price: 69, image: null, available: true },
];

const MOCK_REVIEWS = [
  { id: 1, author: "Jamie L.", rating: 5, date: "Jan 12, 2026", comment: "Absolutely top-tier experience. My ball python arrived calm and healthy. Communication was prompt and professional throughout." },
  { id: 2, author: "Tara S.", rating: 5, date: "Dec 3, 2025", comment: "Third time ordering from Desert Dwellers. Consistent quality and stellar packing. Would never go anywhere else." },
  { id: 3, author: "Carlos M.", rating: 4, date: "Nov 18, 2025", comment: "Great seller overall. The gecko I ordered was exactly as described. Shipping took a day longer than expected but animal was perfect." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAYS_ORDER = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

function getTodayStatus(hours: typeof MOCK_STORE.store_hours) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const todayHours = hours.find(h => h.day === today);
  if (!todayHours || !todayHours.is_open) return { open: false, label: "Closed today" };
  return { open: true, label: `Open today · ${todayHours.open_time} – ${todayHours.close_time}` };
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
function ProductCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  const [liked, setLiked] = useState(false);
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden group"
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
        <p className="text-base font-bold" style={{ color: "#1a6b3a" }}>${product.price}</p>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: typeof MOCK_REVIEWS[0] }) {
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-800">{review.author}</p>
          <p className="text-xs text-gray-400">{review.date}</p>
        </div>
        <StarRow rating={review.rating} size={12} />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StoreDetailsPage() {
  const store = MOCK_STORE;
  const [activeTab, setActiveTab] = useState<"listings" | "reviews" | "about">("listings");
  const todayStatus = getTodayStatus(store.store_hours);

  const tabs = [
    { key: "listings", label: `Listings (${store.inventory_count})` },
    { key: "reviews",  label: `Reviews (${store.review_count})` },
    { key: "about",    label: "About & Policy" },
  ] as const;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #f4f8f5 0%, #e8f0e8 40%, #c8dac8 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <button
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
          style={{ fontFamily: "sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>
      </div>

      {/* Hero Cover */}
      <div className="max-w-5xl mx-auto px-6">
        <div
          className="relative w-full rounded-3xl overflow-hidden"
          style={{ height: 220 }}
        >
          {store.cover_photo ? (
            <img src={store.cover_photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%)" }}
            />
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }}
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
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10 mb-6 relative z-10">
          {/* Logo */}
          <div
            className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            {store.logo ? (
              <img src={store.logo} alt={store.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-white text-3xl font-bold">{store.name.charAt(0)}</span>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900" style={{ letterSpacing: "-0.02em" }}>
                {store.name}
              </h1>
              {store.is_verified && (
                <span
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "#e6f4ea", color: "#1a6b3a" }}
                >
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
              <ShippingBadge type={store.shipping_type} />
            </div>
            <div className="flex items-center gap-3 flex-wrap" style={{ fontFamily: "sans-serif" }}>
              <div className="flex items-center gap-1.5">
                <StarRow rating={store.rating} size={13} />
                <span className="text-sm font-semibold text-gray-700">{store.rating.toFixed(2)}</span>
                <span className="text-xs text-gray-400">({store.review_count} reviews)</span>
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
                {store.inventory_count} items available
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-2 flex-shrink-0" style={{ fontFamily: "sans-serif" }}>
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
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">

          {/* Left column — tabs content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div
              className="flex gap-1 p-1 rounded-xl"
              style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", fontFamily: "sans-serif" }}
            >
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: activeTab === tab.key ? "#fff" : "transparent",
                    color: activeTab === tab.key ? "#1a6b3a" : "#6b7280",
                    boxShadow: activeTab === tab.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Listings */}
            {activeTab === "listings" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOCK_PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-3">
                {/* Summary */}
                <div
                  className="bg-white rounded-2xl p-5 flex items-center gap-6"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", fontFamily: "sans-serif" }}
                >
                  <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}>
                      {store.rating}
                    </p>
                    <StarRow rating={store.rating} size={16} />
                    <p className="text-xs text-gray-400 mt-1">{store.review_count} reviews</p>
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
                {MOCK_REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
              </div>
            )}

            {/* About */}
            {activeTab === "about" && (
              <div className="space-y-4">
                <div
                  className="bg-white rounded-2xl p-5"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", fontFamily: "sans-serif" }}
                >
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">About the Store</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{store.about}</p>
                </div>
                <div
                  className="bg-white rounded-2xl p-5"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", fontFamily: "sans-serif" }}
                >
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
          <div className="space-y-4" style={{ fontFamily: "sans-serif" }}>

            {/* Contact */}
            {store.contact_visible && (
              <div
                className="bg-white rounded-2xl p-4 space-y-3"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</h3>
                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-green-700 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#e6f4ea" }}>
                      <Phone className="w-3.5 h-3.5" style={{ color: "#1a6b3a" }} />
                    </div>
                    {store.phone}
                  </a>
                )}
                {store.email && (
                  <a
                    href={`mailto:${store.email}`}
                    className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-green-700 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#e6f4ea" }}>
                      <Mail className="w-3.5 h-3.5" style={{ color: "#1a6b3a" }} />
                    </div>
                    {store.email}
                  </a>
                )}
              </div>
            )}

            {/* Address */}
            <div
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Location</h3>
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#e6f4ea" }}>
                  <MapPin className="w-3.5 h-3.5" style={{ color: "#1a6b3a" }} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {store.address.address_line_1}
                  {store.address.address_line_2 && `, ${store.address.address_line_2}`}
                  <br />
                  {store.address.city}, {store.address.state} {store.address.zip_code}
                  <br />
                  {store.address.country}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Hours</h3>
                <Clock className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="space-y-1.5">
                {DAYS_ORDER.map(day => {
                  const hour = store.store_hours.find(h => h.day === day);
                  const isToday = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === day;
                  return (
                    <div
                      key={day}
                      className="flex justify-between items-center text-xs py-0.5 rounded-md px-1 -mx-1"
                      style={{
                        background: isToday ? "#f0faf4" : "transparent",
                        fontWeight: isToday ? 600 : 400,
                      }}
                    >
                      <span className="text-gray-600 capitalize">{day}</span>
                      {hour?.is_open ? (
                        <span style={{ color: "#1a6b3a" }}>
                          {hour.open_time} – {hour.close_time}
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
            <div
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping</h3>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#e6f4ea" }}>
                  <Truck className="w-3.5 h-3.5" style={{ color: "#1a6b3a" }} />
                </div>
                <div>
                  <ShippingBadge type={store.shipping_type} />
                  <p className="text-xs text-gray-400 mt-1">Live arrival guaranteed</p>
                </div>
              </div>
            </div>

            {/* Owner */}
            <div
              className="bg-white rounded-2xl p-4 flex items-center gap-3"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%)" }}
              >
                {store.owner.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{store.owner.name}</p>
                <p className="text-xs text-gray-400">Store owner · Member since {store.owner.joined}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}