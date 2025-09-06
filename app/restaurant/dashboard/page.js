"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", price: "", description: "" });
  const [editingItem, setEditingItem] = useState(null);

  // ✅ Fetch menu
  async function fetchMenu() {
    try {
      const res = await fetch("http://localhost:5000/restaurant/menu", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setMenu(data.items || []);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  // ✅ Add new item
  async function handleAddItem(e) {
    e.preventDefault();
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
      setError("Server error");
    }
  }

  // ✅ Delete item
  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:5000/restaurant/menu/item/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchMenu();
    } catch (err) {
      setError("Server error");
    }
  }

  // ✅ Edit item (update)
  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/restaurant/menu/item/${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editingItem),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchMenu();
      setEditingItem(null);
    } catch (err) {
      setError("Server error");
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Restaurant Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <h2 className="text-xl font-semibold mb-3">Your Menu</h2>
      {menu.length === 0 ? (
        <p>No menu items yet.</p>
      ) : (
        <ul>
          {menu.map((item) => (
            <li key={item._id} className="flex justify-between border-b py-2">
              <div>
                <span className="font-semibold">{item.name}</span> - ₹{item.price}
                {item.description && <p className="text-gray-500">{item.description}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Add New Item */}
      <form onSubmit={handleAddItem} className="mt-6 space-y-2">
        <h3 className="font-semibold">Add Menu Item</h3>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="border p-2 w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
      </form>

      {/* ✅ Edit Item */}
      {editingItem && (
        <form onSubmit={handleUpdate} className="mt-6 space-y-2 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Edit Item</h3>
          <input
            type="text"
            value={editingItem.name}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            value={editingItem.price}
            onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            value={editingItem.description || ""}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
            className="border p-2 w-full"
          />
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
