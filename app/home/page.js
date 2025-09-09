"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Phone,
  Clock,
  Star,
  ShoppingBag,
  Edit3,
  Save,
  ChefHat,
  History,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch restaurants
  async function fetchRestaurants() {
    try {
      const res = await fetch("https://foods24-be.vercel.app/api/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRestaurants(data || []);
    } catch {
      setError("Failed to load restaurants");
    }
  }

  // Fetch user profile
  async function fetchUser() {
    try {
      const res = await fetch("https://foods24-be.vercel.app/auth/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch {
      setError("Failed to load profile");
    }
  }

  useEffect(() => {
    if (!token) {
      router.push("/user/login");
      return;
    }
    fetchRestaurants();
    fetchUser();
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/user/login");
  };

  // Close burger menu when clicking outside
  const closeBurgerMenu = () => {
    setIsBurgerMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Foods24
              </h1>
              <p className="text-gray-600 mt-1">
                Delicious food, delivered fast
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Delivery Available</span>
              </div>
              
              {/* Burger Menu Button */}
              <button
                onClick={() => setIsBurgerMenuOpen(!isBurgerMenuOpen)}
                className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors">
                <Menu className="w-6 h-6 text-orange-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Burger Menu Overlay */}
      {isBurgerMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeBurgerMenu}></div>
      )}

      {/* Burger Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isBurgerMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="p-6">
          {/* Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-800">Menu</h3>
            <button
              onClick={closeBurgerMenu}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="space-y-3">
            <button
              onClick={() => {
                router.push("/home/orderhistory");
                closeBurgerMenu();
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="bg-blue-100 p-2 rounded-lg">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="font-medium text-gray-800">Order History</span>
                <p className="text-sm text-gray-600">View past orders</p>
              </div>
            </button>

            <button
              onClick={() => {
                router.push("/home/profile");
                closeBurgerMenu();
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="bg-green-100 p-2 rounded-lg">
                <Edit3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <span className="font-medium text-gray-800">Edit Profile</span>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </button>

            <div className="border-t border-gray-200 my-4"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left">
              <div className="bg-red-100 p-2 rounded-lg">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <span className="font-medium text-red-800">Logout</span>
                <p className="text-sm text-red-600">Sign out of your account</p>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Restaurants Section - Now the main content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full mr-4">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Available Restaurants
              </h2>
              <p className="text-gray-600">
                Choose from our partner restaurants
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => router.push(`/home/${restaurant._id}`)}
                className="group cursor-pointer bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 border border-orange-100 hover:border-orange-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {restaurant.r_name}
                  </h3>
                  <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <ChefHat className="w-4 h-4 text-orange-600" />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm">{restaurant.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm">{restaurant.phone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-orange-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-orange-600">
                      View Menu
                    </span>
                    <div className="bg-orange-500 text-white p-2 rounded-full group-hover:bg-orange-600 transition-colors">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {restaurants.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No restaurants available
              </h3>
              <p className="text-gray-500">
                Check back later for amazing food options!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}