"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Phone,
  Clock,
  Star,
  ShoppingBag,
  Edit3,
  Save,
  ChefHat,
  History,
} from "lucide-react";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch restaurants
  async function fetchRestaurants() {
    try {
      const res = await fetch("https://foods24-be.vercel.app/api/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRestaurants(data || []);
    } catch {
      setError("Failed to load restaurants");
    }
  }

  // Fetch user profile
  async function fetchUser() {
    try {
      const res = await fetch("https://foods24-be.vercel.app/auth/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch {
      setError("Failed to load profile");
    }
  }

  // Fetch order history
  async function fetchOrders() {
    try {
      const res = await fetch("https://foods24-be.vercel.app/order/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data || []);
    } catch {
      setError("Failed to load orders");
    }
  }

  useEffect(() => {
    if (!token) {
      router.push("/user/login");
      return;
    }
    fetchRestaurants();
    fetchUser();
    fetchOrders();
  }, [token]);

  // Update profile
  async function handleUpdate() {
    try {
      const res = await fetch("https://foods24-be.vercel.app/auth/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Profile updated!");
      setIsEditing(false);
    } catch {
      setError("Update failed");
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "ongoing":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Foods24
              </h1>
              <p className="text-gray-600 mt-1">
                Delicious food, delivered fast
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Delivery Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Main Content - Restaurants First */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full mr-4">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Available Restaurants
                </h2>
                <p className="text-gray-600">
                  Choose from our partner restaurants
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  onClick={() => router.push(`/home/${restaurant._id}`)}
                  className="group cursor-pointer bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 border border-orange-100 hover:border-orange-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {restaurant.r_name}
                    </h3>
                    <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <ChefHat className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="text-sm">{restaurant.location}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="text-sm">{restaurant.phone}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-orange-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-orange-600">
                        View Menu
                      </span>
                      <div className="bg-orange-500 text-white p-2 rounded-full group-hover:bg-orange-600 transition-colors">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {restaurants.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <ChefHat className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No restaurants available
                </h3>
                <p className="text-gray-500">
                  Check back later for amazing food options!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Content Row - Order History and Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order History Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full mr-4">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Order History
                </h2>
                <p className="text-gray-600">Your recent orders</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No past orders yet</p>
                <p className="text-sm text-gray-500">
                  Your order history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {order.restaurant?.r_name || "Unknown Restaurant"}
                      </h4>
                      <span className="text-lg font-bold text-green-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Section */}
          {user && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      My Profile
                    </h2>
                    <p className="text-gray-600">Manage your account</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  {isEditing ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isEditing ? "Save" : "Edit"}
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user.name || ""}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={user.phone || ""}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                {isEditing && (
                  <button
                    onClick={handleUpdate}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                    Update Profile
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
