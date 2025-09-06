"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://foods24-be.vercel.app/auth/restaurant/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        router.push("/restaurant/dashboard"); // ⬅️ redirect
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h1 className="text-xl font-bold mb-4">Restaurant Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border rounded w-full px-3 py-2 mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded w-full px-3 py-2 mb-4"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
        {/* Button for Registration  */}
        <button
          type="button"
          onClick={() => router.push("/restaurant/register")}
          className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          New Partner
        </button>
      </form>
    </div>
  );
}
