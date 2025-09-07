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
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

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
      router.replace("/restaurant/login"); // redirect if no token
      return;
    }
    fetchData(token);
  }, [router]);

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
      await fetchMenu();
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
        await fetchMenu();
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
      await fetchMenu();
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
      fetchOrders();
    } catch {
      setError("Failed to update order");
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
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

  const pendingOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "cancelled"
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-400">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-blue-600" />
                ) : (
                  <Menu className="w-6 h-6 text-blue-600" />
                )}
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Restaurant Dashboard
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your orders and menu
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-orange-100 px-3 py-2 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800 font-semibold">
                  {pendingOrders.length} Active Orders
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
          } overflow-hidden transition-all duration-300 bg-white shadow-xl border-r border-gray-200`}>
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "orders"
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                <Package className="w-5 h-5" />
                <span className="font-medium">Orders</span>
              </button>

              <button
                onClick={() => setActiveTab("menu")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "menu"
                    ? "bg-purple-100 text-purple-700 border-2 border-purple-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                <ChefHat className="w-5 h-5" />
                <span className="font-medium">Menu Management</span>
              </button>
            </nav>

            {/* Menu Items Quick View */}
            {activeTab === "menu" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Menu Items
                  </h3>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                    <Plus className="w-5 h-5 text-green-600" />
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {menu.map((item) => (
                    <div
                      key={item._id}
                      className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-green-600 font-semibold">
                            ₹{item.price}
                          </p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {menu.length === 0 && (
                  <div className="text-center py-8">
                    <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No menu items yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full mr-4">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Active Orders
                  </h2>
                  <p className="text-gray-600">
                    Manage incoming and ongoing orders
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-500">New orders will appear here</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-shadow">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Order #{order._id.substring(0, 8).toUpperCase()}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getOrderStatusColor(
                              order.status
                            )}`}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </div>
                          <p className="text-2xl font-bold text-green-600 mt-2">
                            ₹{order.totalAmount}
                          </p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Customer Details
                        </h4>
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
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Order Items
                        </h4>
                        <div className="space-y-2">
                          {order.items &&
                            order.items.map((i, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <span className="font-medium text-gray-800">
                                    {i.item?.name || "Unknown Item"}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {" "}
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
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "ongoing")
                          }
                          className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                          <Pause className="w-4 h-4" />
                          <span>Mark Ongoing</span>
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "completed")
                          }
                          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                          <CheckCircle className="w-4 h-4" />
                          <span>Complete</span>
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "cancelled")
                          }
                          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                          <XCircle className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "menu" && (
            <div className="space-y-6">
              {/* Add New Item Form */}
              {showAddForm && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Plus className="w-6 h-6 mr-2 text-green-600" />
                    Add New Menu Item
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleAddItem}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
                      Add Item
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Item Form */}
              {editingItem && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Edit className="w-6 h-6 mr-2 text-blue-600" />
                    Edit Menu Item
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <textarea
                      value={editingItem.description || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          description: e.target.value,
                        })
                      }
                      className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Menu Items Grid */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4">
                      <ChefHat className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Menu Items
                      </h2>
                      <p className="text-gray-600">
                        Manage your restaurant menu
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {menu.length === 0 ? (
                  <div className="text-center py-12">
                    <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No menu items yet
                    </h3>
                    <p className="text-gray-500">
                      Add your first menu item to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menu.map((item) => (
                      <div
                        key={item._id}
                        className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.name}
                          </h3>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center mb-3">
                          {/* <DollarSign className="w-5 h-5 text-green-600 mr-1" /> */}
                          <span className="text-2xl font-bold text-green-600">
                            ₹{item.price}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 text-sm">
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
