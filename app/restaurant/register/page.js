"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Store, 
  MapPin, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function RestaurantRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    r_name: "",
    location: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://foods24-be.vercel.app/auth/restaurant/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Restaurant registered successfully!");
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/restaurant/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    return (
      form.email &&
      form.password &&
      form.r_name &&
      form.location &&
      form.phone
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Platform</h1>
          <p className="text-gray-600">Start your journey as a restaurant partner</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-700 text-sm">{success}</p>
                <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Restaurant Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Restaurant Name *</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="r_name"
                  placeholder="Your restaurant name"
                  value={form.r_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="location"
                  placeholder="Restaurant address"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Contact number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Business email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || !validateForm()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span className="font-medium">Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => router.push("/restaurant/login")}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-green-400 hover:text-green-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Login</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            By registering, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}