"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // State for menu item CRUD operations
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [editingItem, setEditingItem] = useState(null);

  // Fetch menu data
  async function fetchMenu() {
    try {
      const res = await fetch("http://localhost:5000/restaurant/menu", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMenu(data.items || []);
    } catch {
      setError("Failed to load menu");
    }
  }

  // Fetch orders data
  async function fetchOrders() {
    try {
      const res = await fetch("http://localhost:5000/order/restaurant", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setOrders(data || []);
    } catch {
      setError("Failed to load orders");
    }
  }

  // Fetch both menu and orders
  const fetchData = async () => {
    await Promise.all([fetchMenu(), fetchOrders()]);
  };

  // Handler to add a new menu item
  async function handleAddItem() {
    try {
      const res = await fetch("http://localhost:5000/restaurant/menu/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to add item");
      await fetchMenu();
      setNewItem({ name: "", price: "", description: "" });
    } catch (err) {
      setError("Failed to add item. Please check your inputs.");
    }
  }

  // Handler to delete a menu item
  async function handleDelete(id) {
    try {
      const res = await fetch(
        `http://localhost:5000/restaurant/menu/item/${id}`,
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

  // Handler to update a menu item
  async function handleUpdate() {
    try {
      const res = await fetch(
        `http://localhost:5000/restaurant/menu/item/${editingItem._id}`,
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
      await fetch(`http://localhost:5000/order/${orderId}/status`, {
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Restaurant Dashboard
      </h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Left Column: Orders Section */}
        <div className="w-full lg:w-1/2 p-4 bg-white rounded-lg shadow-md border border-gray-200 mb-6 lg:mb-0">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Incoming Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 italic">No orders yet.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-lg font-bold text-gray-800">
                      Order ID: {order._id.substring(0, 6)}
                    </p>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        order.status === "ongoing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    <strong>User:</strong> {order.user?.name || "N/A"} (
                    {order.user?.email || "N/A"})
                  </p>
                  <ul className="ml-4 mt-2 list-disc list-inside text-gray-600">
                    {order.items.map((i) => (
                      <li key={i.item._id}>
                        {i.item.name} x {i.quantity} (₹
                        {i.item.price * i.quantity})
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xl font-bold text-gray-800">
                    Total: ₹{order.totalAmount}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => updateOrderStatus(order._id, "ongoing")}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200">
                      Mark Ongoing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "completed")}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                      Mark Completed
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Column: Menu CRUD Section */}
        <div className="w-full lg:w-1/2 p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Your Menu
          </h2>
          {menu.length === 0 ? (
            <p className="text-gray-500 italic">No menu items yet.</p>
          ) : (
            <ul className="space-y-4">
              {menu.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-b border-gray-200 py-3">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-gray-600"> - ₹{item.price}</span>
                    {item.description && (
                      <p className="text-gray-500 text-sm mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors duration-200">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors duration-200">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Add New Item Section */}
          <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700">
              Add New Menu Item
            </h3>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddItem}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold w-full hover:bg-blue-700 transition-colors duration-200">
              Add Item
            </button>
          </div>

          {/* Edit Item Section (Conditionally rendered) */}
          {editingItem && (
            <div className="mt-6 space-y-3 bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-semibold text-gray-700">Edit Item</h3>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
                className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, price: e.target.value })
                }
                className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={editingItem.description || ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    description: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex-1 hover:bg-green-700 transition-colors duration-200">
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold flex-1 hover:bg-gray-600 transition-colors duration-200">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
