"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchRestaurants() {
      try {
        const res = await fetch(
          "https://foods24-be.vercel.app/api/restaurants",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRestaurants();
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurants.map((r) => (
          <div
            key={r._id}
            onClick={() => router.push(`/home/${r._id}`)}
            className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
            <h2 className="text-lg font-semibold">{r.r_name}</h2>
            <p>{r.location}</p>
            <p>{r.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
