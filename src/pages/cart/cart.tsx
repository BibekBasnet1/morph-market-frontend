import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "../../lib/api/cart";
import type { Cart } from "../../types/CartTypes";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import PaymentMethodsModal from "../../components/payments/PaymentMethodsModal";

/* ---------------- Local cart helpers ---------------- */
const loadLocalCarts = (): Cart[] => {
  try {
    return JSON.parse(localStorage.getItem("cart-products") || "[]");
  } catch {
    return [];
  }
};

const saveLocalCarts = (carts: Cart[]) => {
  localStorage.setItem("cart-products", JSON.stringify(carts));
};

const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  /* ---------------- Local cart state ---------------- */
  const [localCarts, setLocalCarts] = useState<Cart[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    setLocalCarts(loadLocalCarts());
  }, []);

  /* ---------------- API carts ---------------- */
  const { data: apiCarts = [] } = useQuery<Cart[]>({
    queryKey: ["carts"],
    queryFn: CartService.list,
    enabled: isAuthenticated,
  });

  /* ---------------- Merge carts ---------------- */
  const carts = useMemo<Cart[]>(() => {
    return isAuthenticated ? [...apiCarts, ...localCarts] : localCarts;
    
  }, [apiCarts, localCarts, isAuthenticated]);
console.log("Carts:", carts);
  /* ---------------- API mutations ---------------- */
  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      CartService.update(id, { quantity } as any),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carts"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => CartService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      toast.success("Item removed");
    },
  });

  /* ---------------- Handlers ---------------- */
  const updateQuantity = (item: Cart, quantity: number) => {
    if (quantity < 1) return;

    // Guest cart
    if (!isAuthenticated || !item.user_id) {
      const updated = localCarts.map((c) =>
        c.id === item.id ? { ...c, quantity } : c
      );
      setLocalCarts(updated);
      saveLocalCarts(updated);
      return;
    }

    // API cart
    updateMutation.mutate({ id: item.id, quantity });
  };

  const removeItem = (item: Cart) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );

    if (!confirmed) return;

    // Guest cart
    if (!isAuthenticated || !item.user_id) {
      const updated = localCarts.filter((c) => c.id !== item.id);
      setLocalCarts(updated);
      saveLocalCarts(updated);
      toast.success("Item removed");
      return;
    }

    // API cart
    removeMutation.mutate(item.id);
  };

  const totalAmount = carts.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const estimatedTax = totalAmount * 0.01;

if (!carts.length) {
  return (
    <div className="flex flex-col dark:text-white items-center justify-center py-16 px-6 text-center">
      <div className="mb-4 text-6xl">🛒</div>

      <h2 className="text-xl font-semibold mb-2">
        Your cart is empty
      </h2>

      <p className="text-muted-foreground mb-6 max-w-sm">
        Looks like you haven’t added anything yet. Start exploring and add items you love.
      </p>

      <Button
        onClick={() => navigate("/marketplace")}
        className="px-6"
      >
        Browse Products
      </Button>
    </div>
  );
}


  return (
  <div className="dark:text-white mx-auto py-10 px-4">
    {/* Header */}
    <div className="mb-6">
      <h1 className="text-3xl font-semibold">Your Shopping Cart</h1>
      <p className="text-sm text-muted-foreground mt-1">
        You have {carts.length} item ready for safe delivery.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ---------------- LEFT: CART ITEMS ---------------- */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-4 text-xs font-semibold text-muted-foreground border-b">
              <div className="col-span-7">PRODUCT DETAILS</div>
              <div className="col-span-2 text-center">QTY</div>
              <div className="col-span-3 text-right">PRICE</div>
            </div>

            {carts.map((item: any) => {
              const product = item.product;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 px-6 py-5 border-b last:border-b-0 items-center"
                >
                  {/* Product */}
                  <div className="col-span-7 flex gap-4">
                    <img
                      src={product?.image ?? "https://placehold.co/100x100"}
                      alt={product?.name}
                      className="w-20 h-20 rounded object-cover"
                    />

                    <div className="space-y-1">
                      <p className="font-medium">
                        {product?.name ?? `Product #${item.product_id}`}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Breeder: {product?.store?.name ?? "N/A"}
                      </p>

                      <button
                        onClick={() => removeItem(item)}
                        className="text-xs text-red-600 hover:underline mt-2"
                      >
                        Remove from cart
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item, item.quantity - 1)
                        }
                      >
                        −
                      </Button>
                      <span className="min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-3 text-right font-semibold">
                    ${Number(item.price).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ---------------- Shipping & Estimates ---------------- */}
        {/* <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              Shipping & Estimates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Zip / Postal Code
                </label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="90210"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                  <Button size="sm">Calculate</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Live animals require priority shipping.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Notes to Breeder
                </label>
                <textarea
                  rows={3}
                  placeholder="Specific handling instructions or delivery dates..."
                  className="w-full border rounded px-3 py-2 text-sm mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* ---------------- RIGHT: ORDER SUMMARY ---------------- */}
      <div className="space-y-4">
        <Card className="sticky top-6">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>$45.00</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (Estimated)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">
                <span>Order Total</span>
                <span>${(totalAmount + 87).toFixed(2)}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() =>
                isAuthenticated
                  ? setIsPaymentModalOpen(true)
                  : navigate("/login")
              }
            >
              Proceed to Checkout
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By clicking checkout you agree to the breeder’s store policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

    <PaymentMethodsModal
      isOpen={isPaymentModalOpen}
      onClose={() => setIsPaymentModalOpen(false)}
      items={carts.map((cart) => {
        const product = (cart as any).product;
        return {
          product_id: cart.product_id,
          product_name: product?.name || "Unknown Product",
          store_id: product?.store_id || 1,
          quantity: cart.quantity,
          price: Number(cart.price),
        };
      })}
      onSuccess={() => {
        setIsPaymentModalOpen(false);
        // Clear the cart after successful payment
        setLocalCarts([]);
        saveLocalCarts([]);
        queryClient.invalidateQueries({ queryKey: ["carts"] });
        toast.success("Order placed successfully!");
      }}
    />
  </div>
);

};

export default CartPage;
