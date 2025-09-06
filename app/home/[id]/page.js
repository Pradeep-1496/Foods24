"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RestaurantDetails() {
  const { id } = useParams(); // restaurantId
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch restaurant details
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await fetch(
          `https://foods24-be.vercel.app/api/restaurants/${id}`, // or vercel backend URL
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurant");
      }
    }
    if (id) fetchRestaurant();
  }, [id, token]);

  // ✅ Cart functions
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
  }

  function removeFromCart(itemId) {
    setCart(cart.filter((c) => c._id !== itemId));
  }

  function decreaseQuantity(itemId) {
    setCart(
      cart
        .map((c) => (c._id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ✅ Place order
  async function placeOrder() {
    if (cart.length === 0) return alert("Your cart is empty!");

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

      alert("✅ Order placed successfully!");
      setCart([]);
      router.push("/home"); // redirect back to restaurants list
    } catch (err) {
      console.error(err);
      setError("Could not place order");
    }
  }

  if (!restaurant) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      {/* Restaurant Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{restaurant.r_name}</h1>
        <p>{restaurant.location}</p>
        <p>{restaurant.phone}</p>
      </div>

      {/* Menu */}
      <h2 className="text-xl font-semibold mb-3">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {restaurant.menu?.items?.map((item) => (
          <div
            key={item._id}
            className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p>₹{item.price}</p>
              <p>{item.description}</p>
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
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul className="mb-4">
          {cart.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center p-2 border-b">
              <span>
                {item.name} - ₹{item.price} × {item.quantity}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  className="bg-yellow-500 text-white px-2 pb-1 rounded">
                  -
                </button>

                <span className="pl-2 pr-2 border rounded">
                  {" "}
                  {item.quantity}{" "}
                </span>

                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-500 text-white px-2 pb-1 rounded">
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-2 pb-1 rounded">
                  x
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Total + Checkout */}
      <div className="flex justify-between items-center mt-4">
        <p className="font-bold">Total: ₹{total}</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={placeOrder}>
          Place Order
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
