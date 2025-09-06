"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://foods24-be.vercel.app/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token in localStorage
      localStorage.setItem("token", data.token);

      // redirect to home
      router.push("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-2xl font-bold text-center mb-4">User Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded-lg"
        />
        {/* Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Button for Registration  */}
        <button
          type="button"
          onClick={() => router.push("/user/register")}
          className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Create New User
        </button>
      </form>
    </div>
  );
}
