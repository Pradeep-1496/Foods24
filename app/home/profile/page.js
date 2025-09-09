"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Save,
  Edit3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ProfileEditPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [originalUser, setOriginalUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch user profile
  async function fetchUser() {
    try {
      setLoading(true);
      const res = await fetch("https://foods24-be.vercel.app/auth/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setOriginalUser(data);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      router.push("/user/login");
      return;
    }
    fetchUser();
  }, [token, router]);

  // Update profile
  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://foods24-be.vercel.app/auth/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      setSuccess("Profile updated successfully!");
      setOriginalUser(user);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Reset form
  const handleReset = () => {
    setUser(originalUser);
    setError("");
    setSuccess("");
  };

  // Check if form has changes
  const hasChanges = () => {
    return (
      user.name !== originalUser.name ||
      user.email !== originalUser.email ||
      user.phone !== originalUser.phone
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-orange-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Update your account information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full mr-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
              <p className="text-gray-600">Manage your personal information</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Full Name
              </label>
              <input
                type="text"
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email Address
              </label>
              <input
                type="email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                Phone Number
              </label>
              <input
                type="tel"
                value={user.phone || ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving || !hasChanges()}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Profile</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={!hasChanges()}
                className="flex-1 sm:flex-initial px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                <Edit3 className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Info Message */}
            {hasChanges() && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <p className="text-blue-700 text-sm">
                    You have unsaved changes. Dont forget to update your
                    profile!
                  </p>
                </div>
              </div>
            )}
          </form>

          {/* Account Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Account Information
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Account Status:</span>
                  <span className="ml-2 text-green-600 font-medium">
                    Active
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Member Since:</span>
                  <span className="ml-2 text-gray-800 font-medium">
                    {originalUser.createdAt
                      ? new Date(originalUser.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
