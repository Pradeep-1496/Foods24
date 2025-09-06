"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await fetch(
          `https://foods24-be.vercel.app/api/restaurants/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error(err);
      }
    }
    if (id) fetchRestaurant();
  }, [id, token]);

  // ✅ Add item or increase qty
  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  // ✅ Decrease qty or remove if 0
  function decreaseFromCart(itemId) {
    setCart((prev) =>
      prev
        .map((i) =>
          i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  // ✅ Remove completely
  function removeFromCart(itemId) {
    setCart((prev) => prev.filter((i) => i._id !== itemId));
  }

  // ✅ Total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!restaurant) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      {/* Restaurant Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{restaurant.r_name}</h1>
        <p>{restaurant.location}</p>
        <p>{restaurant.phone}</p>
      </div>

      {/* Menu Items */}
      <h2 className="text-xl font-semibold mb-3">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {restaurant.menu?.items?.map((item) => (
          <div
            key={item._id}
            className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="bg-green-600 text-white px-3 py-1 rounded">
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <h2 className="text-xl font-semibold mb-3">Your Order</h2>
      <ul className="mb-4">
        {cart.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center p-2 border-b">
            <span>
              {item.name} - ₹{item.price} × {item.quantity}
            </span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => decreaseFromCart(item._id)}
                className="px-2 bg-gray-300 rounded">
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => addToCart(item)}
                className="px-2 bg-gray-300 rounded">
                +
              </button>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-600 ml-2">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total + Checkout */}
      <div className="flex justify-between items-center">
        <p className="font-bold">Total: ₹{total}</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => alert("Place Order API will go here")}>
          Place Order
        </button>
      </div>
    </div>
  );
}
