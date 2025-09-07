"use client";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  Phone,
  Mail,
  Package,
  ChefHat,
  Bell,
  CheckCircle,
  XCircle,
  Pause,
  Settings,
  LogOut,
  Save,
  Camera,
  MapPin,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    image: null,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // State for menu item CRUD operations
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/restaurant/login");
      return;
    }
    fetchData(token);
    fetchProfile(token);
  }, [router]);

  // Fetch profile data
  async function fetchProfile(token) {
    try {
      const res = await fetch("https://foods24-be.vercel.app/restaurant/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      }
    } catch {
      // Handle error silently or set default values
    }
  }

  // Fetch menu data
  async function fetchMenu(token) {
    try {
      const res = await fetch("https://foods24-be.vercel.app/restaurant/menu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMenu(Array.isArray(data.items) ? data.items : []);
    } catch {
      setError("Failed to load menu");
      setMenu([]);
    }
  }

  // Fetch orders data
  async function fetchOrders(token) {
    try {
      const res = await fetch(
        "https://foods24-be.vercel.app/order/restaurant",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load orders");
      setOrders([]);
    }
  }

  // Fetch both menu and orders
  const fetchData = async (token) => {
    await Promise.all([fetchMenu(token), fetchOrders(token)]);
  };

  // Handler to add a new menu item
  async function handleAddItem() {
    try {
      const res = await fetch(
        "https://foods24-be.vercel.app/restaurant/menu/item",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newItem),
        }
      );
      if (!res.ok) throw new Error("Failed to add item");
      await fetchMenu(localStorage.getItem("token"));
      setNewItem({ name: "", price: "", description: "" });
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add item. Please check your inputs.");
    }
  }

  // Handler to delete a menu item
  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(
          `https://foods24-be.vercel.app/restaurant/menu/item/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to delete item");
        await fetchMenu(localStorage.getItem("token"));
      } catch (err) {
        setError("Failed to delete item.");
      }
    }
  }

  // Handler to update a menu item
  async function handleUpdate() {
    try {
      const res = await fetch(
        `https://foods24-be.vercel.app/restaurant/menu/item/${editingItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editingItem),
        }
      );
      if (!res.ok) throw new Error("Failed to update item");
      await fetchMenu(localStorage.getItem("token"));
      setEditingItem(null);
    } catch (err) {
      setError("Failed to update item.");
    }
  }

  // Update order status
  async function updateOrderStatus(orderId, status) {
    try {
      await fetch(`https://foods24-be.vercel.app/order/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders(localStorage.getItem("token"));
    } catch {
      setError("Failed to update order");
    }
  }

  // Profile handlers
  const handleProfileSave = async () => {
    try {
      const res = await fetch("https://foods24-be.vercel.app/restaurant/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setIsEditingProfile(false);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/restaurant/login");
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };

  const pendingOrders = getOrdersByStatus("pending");
  const ongoingOrders = getOrdersByStatus("ongoing");
  const completedOrders = getOrdersByStatus("completed");
  const activeOrdersCount = pendingOrders.length + ongoingOrders.length;

  const OrderSection = ({ title, orders, statusColor, emptyMessage }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <div className={`w-4 h-4 rounded-full ${statusColor} mr-3`}></div>
          {title}
          <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
            {orders.length}
          </span>
        </h3>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-200"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">
                    Order #{order._id.substring(0, 8).toUpperCase()}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Customer Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{order.user?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{order.user?.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{order.user?.email || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-800 mb-3">Order Items</h5>
                <div className="space-y-2">
                  {order.items &&
                    order.items.map((i, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium text-gray-800">
                            {i.item?.name || "Unknown Item"}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            x {i.quantity}
                          </span>
                        </div>
                        <span className="font-semibold text-green-600">
                          ₹{(i.item?.price || 0) * i.quantity}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order._id, "ongoing")}
                      className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Start Preparing</span>
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "cancelled")}
                      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
                {order.status === "ongoing" && (
                  <button
                    onClick={() => updateOrderStatus(order._id, "completed")}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-xl border-b-4 border-gradient-to-r from-blue-400 to-purple-400">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Restaurant Dashboard
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your orders and menu efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-3 rounded-xl border border-orange-200">
                <Bell className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800 font-semibold">
                  {activeOrdersCount} Active Orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-80" : "w-0"
          } overflow-hidden transition-all duration-300 bg-white shadow-2xl border-r border-gray-100`}
        >
          <div className="p-8">
            {/* Profile Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  {isEditingProfile && (
                    <label className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="flex-1">
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg text-lg font-semibold"
                      placeholder="Restaurant Name"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-gray-800">
                      {profile.name || "Restaurant Name"}
                    </h3>
                  )}
                </div>
              </div>

              {isEditingProfile && (
                <div className="space-y-3">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Phone"
                  />
                  <textarea
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows="2"
                    placeholder="Address"
                  />
                  <textarea
                    value={profile.description}
                    onChange={(e) =>
                      setProfile({ ...profile, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows="3"
                    placeholder="Restaurant Description"
                  />
                </div>
              )}

              <div className="flex justify-between mt-4">
                {isEditingProfile ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleProfileSave}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            <nav className="space-y-4 mb-8">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-200 ${
                  activeTab === "orders"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Orders</span>
              </button>

              <button
                onClick={() => setActiveTab("menu")}
                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-200 ${
                  activeTab === "menu"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChefHat className="w-5 h-5" />
                <span className="font-medium">Menu Management</span>
              </button>
            </nav>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-6 py-4 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl shadow-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl mr-6 shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Order Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Track and manage all your restaurant orders
                  </p>
                </div>
              </div>

              {/* Pending Orders */}
              <OrderSection
                title="Pending Orders"
                orders={pendingOrders}
                statusColor="bg-orange-400"
                emptyMessage="No pending orders"
              />

              {/* Ongoing Orders */}
              <OrderSection
                title="Ongoing Orders"
                orders={ongoingOrders}
                statusColor="bg-yellow-400"
                emptyMessage="No orders in preparation"
              />

              {/* Completed Orders */}
              <OrderSection
                title="Completed Orders"
                orders={completedOrders}
                statusColor="bg-green-400"
                emptyMessage="No completed orders today"
              />
            </div>
          )}

          {activeTab === "menu" && (
            <div className="space-y-8">
              {/* Add New Item Form */}
              {showAddForm && (
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl mr-4">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    Add New Menu Item
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                      className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      className="md:col-span-2 px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition-all duration-200"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={handleAddItem}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Item Form */}
              {editingItem && (
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
                      <Edit className="w-6 h-6 text-white" />
                    </div>
                    Edit Menu Item
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                      className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="number"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          price: e.target.value,
                        })
                      }
                      className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />
                    <textarea
                      value={editingItem.description || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          description: e.target.value,
                        })
                      }
                      className="md:col-span-2 px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={handleUpdate}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Menu Items Grid */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl mr-6 shadow-lg">
                      <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">
                        Menu Items
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Manage your restaurant menu items
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 shadow-lg transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {menu.length === 0 ? (
                  <div className="text-center py-16">
                    <ChefHat className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No menu items yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Add your first menu item to get started
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Add Your First Item
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menu.map((item) => (
                      <div
                        key={item._id}
                        className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-800 flex-1 mr-2">
                            {item.name}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          <span className="text-3xl font-bold text-green-600">
                            ₹{item.price}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}