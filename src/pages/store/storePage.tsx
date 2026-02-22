import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { StoreService } from "../../lib/api/stores";

export default function StoreDirectory() {
  const navigate = useNavigate();

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: StoreService.getAllStores,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading stores...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f6f4] to-[#dfe8df] px-4 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Store Directory</h1>
        <p className="text-gray-500 mt-2">
          Discover and connect with amazing stores.
        </p>
      </div>

      <div
        className="max-w-7xl mx-auto grid gap-6 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4"
      >
        {stores?.map((store: any) => (
          <div
            key={store.id}
            onClick={() => navigate(`/stores/${store.id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
          >
            {/* Cover */}
            <div className="h-28 bg-gradient-to-r from-[#1f4f3f] to-[#4e8a6d] relative">
              <div className="absolute -bottom-8 left-6">
                <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-xl font-bold text-gray-700">
                  {store.brand_name?.charAt(0) || "S"}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-10 px-6 pb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 truncate">
                  {store.brand_name || store.name}
                </h3>

                {store.is_verified && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                ⭐ {store.rating} ({store.total_reviews})
              </div>

              <div className="text-xs text-gray-400 mt-2 capitalize">
                Shipping: {store.shipping_type?.replace("_", " ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}