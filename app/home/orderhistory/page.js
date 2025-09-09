"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  ShoppingBag,
  MapPin,
  Phone,
  Star,
  ChefHat,
} from "lucide-react";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch order history
  const fetchOrders = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);

      const res = await fetch("https://foods24-be.vercel.app/order/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // First fetch WITH loading
    fetchOrders(true);

    // Auto refresh every 10s WITHOUT loading
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/user/login");
      return;
    }
    fetchOrders();
  }, [token, router]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "ongoing":
        return "🚚";
      case "completed":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-orange-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Order History
              </h1>
              <p className="text-gray-600 mt-1">Track your food journey</p>
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

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full mr-4">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Your Orders ({orders.length})
              </h2>
              <p className="text-gray-600">Complete history of your orders</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by ordering from one of our amazing restaurants!
              </p>
              <button
                onClick={() => router.push("/home")}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <ChefHat className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {order.restaurant?.r_name || "Unknown Restaurant"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Order #{order._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{order.totalAmount}
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  {order.restaurant && (
                    <div className="bg-orange-50 rounded-lg p-3 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                          <span>{order.restaurant.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-orange-500" />
                          <span>{order.restaurant.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Order Items:
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((orderItem, index) => {
                          const itemName = orderItem.item?.name || "Item";
                          const itemPrice = orderItem.item?.price || 0;
                          const quantity = orderItem.quantity || 1;

                          return (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                              <div>
                                <span className="font-medium text-gray-800">
                                  {itemName}
                                </span>
                                <span className="text-gray-600 ml-2">
                                  x{quantity}
                                </span>
                              </div>
                              <span className="font-medium text-gray-800">
                                ₹{itemPrice * quantity}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(
                          order.status
                        )}`}>
                        <span>{getStatusIcon(order.status)}</span>
                        <span>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <strong>Delivery Address:</strong>{" "}
                        {order.deliveryAddress}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
