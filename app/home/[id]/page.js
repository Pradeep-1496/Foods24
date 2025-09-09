"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Clock,
  Phone,
  MapPin,
  Plus,
  Minus,
  X,
  ShoppingCart,
  Heart,
  ChefHat,
} from "lucide-react";

export default function RestaurantDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [cartVisible, setCartVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch restaurant details
  useEffect(() => {
    async function fetchRestaurant() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://foods24-be.vercel.app/api/restaurants/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setRestaurant(data);

        // Extract unique categories
        if (data.menu?.items) {
          const uniqueCategories = [
            ...new Set(data.menu.items.map((item) => item.category || "Other")),
          ];
          setCategories(["all", ...uniqueCategories]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurant");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchRestaurant();
  }, [id, token]);

  // Cart functions with animations
  function addToCart(item) {
    const exists = cart.find((c) => c._id === item._id);
    if (exists) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    // Show cart if hidden and has items
    // if (!cartVisible) {
    //   setCartVisible(true);
    // }
  }

  function removeFromCart(itemId) {
    setCart(cart.filter((c) => c._id !== itemId));
  }

  function updateQuantity(itemId, change) {
    setCart(
      cart
        .map((c) =>
          c._id === itemId
            ? { ...c, quantity: Math.max(0, c.quantity + change) }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Quick order function
  async function quickOrder() {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch(`https://foods24-be.vercel.app/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId: id,
          items: cart.map((i) => ({ itemId: i._id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      setOrderSuccess(true);
      setCart([]);
      // setCartVisible(false);

      setTimeout(() => {
        setOrderSuccess(false);
        router.push("/home/orderhistory");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Could not place order");
    } finally {
      setLoading(false);
    }
  }

  // Filter menu items by category
  const filteredItems =
    restaurant?.menu?.items?.filter(
      (item) => activeCategory === "all" || item.category === activeCategory
    ) || [];

  if (loading && !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious food...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/home")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order Success Animation */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center animate-bounce">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Order Placed!
            </h3>
            <p className="text-gray-600">Redirecting to home...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/home")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex-1 ml-4">
              <h1 className="text-xl font-bold text-gray-900">
                {restaurant.r_name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>25-30 min</span>
                </div>
              </div>
            </div>

            {/* Cart Toggle */}
            <button
              // onClick={() => setCartVisible(!cartVisible)}
              className="relative p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center ">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Restaurant Info Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{restaurant.phone}</span>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="gap-6">
          {/* Menu Section */}
          <div className="flex-1">
            {/* Category Filter */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      activeCategory === category
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const cartItem = cart.find((c) => c._id === item._id);
                const quantity = cartItem?.quantity || 0;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          {item.category && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-600">
                            ₹{item.price}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Controls */}
                      <div className="ml-6">
                        {quantity === 0 ? (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg">
                            Add +
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 bg-orange-50 rounded-full p-1">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating Cart Sidebar */}
          {
            <div className="mt-5 w-full bg-white rounded-2xl shadow-lg p-6 sticky top-24 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  Your Order
                </h3>
                {/* <button
                  onClick={() => setCartVisible(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button> */}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add some delicious items!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </h4>
                          <p className="text-green-600 font-semibold">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-6 h-6 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-semibold text-sm min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{total}
                      </span>
                    </div>

                    <button
                      onClick={quickOrder}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Placing Order...
                        </div>
                      ) : (
                        `Place Order  ₹${total}`
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          }
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
