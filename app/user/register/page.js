"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-300';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return '';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://foods24-be.vercel.app/auth/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Save token (auto login)
      localStorage.setItem("token", data.token);

      // Redirect to home
      router.push("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link href="/user/login" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors duration-200">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Login
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3c0 1.1.9 2 2 2h2c0-1.1-.9-2-2-2zM6 13c-1.1 0-2 .9-2 2v4h2v-4h2v4h2v-4c0-1.1-.9-2-2-2H6z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Join FoodieHub!</h2>
            <p className="text-white/70">Create your account to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-6">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-white/90 text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/50 focus:bg-white/20 focus:border-emerald-400 transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-white/90 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/50 focus:bg-white/20 focus:border-emerald-400 transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div className="mb-4">
            <label className="block text-white/90 text-sm font-medium mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/50 focus:bg-white/20 focus:border-emerald-400 transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-white/50 focus:bg-white/20 focus:border-emerald-400 transition-all duration-300 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white/70 transition-colors duration-200">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {form.password && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-2">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        level <= passwordStrength ? getPasswordStrengthColor() : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength > 0 && (
                  <p className="text-sm text-white/70">
                    Password strength: <span className="font-medium">{getPasswordStrengthText()}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:opacity-70">
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Terms and Privacy */}
          <p className="text-center text-white/60 text-xs mt-4">
            By creating an account, you agree to our{" "}
            <button className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
              Privacy Policy
            </button>
          </p>

          {/* Login Link */}
          <p className="text-center text-white/70 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/user/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200">
              Sign In
            </Link>
          </p>
        </form>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg">🚚</span>
            </div>
            <p className="text-white/60 text-xs">Fast Delivery</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg">🔒</span>
            </div>
            <p className="text-white/60 text-xs">Secure Payment</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg">⭐</span>
            </div>
            <p className="text-white/60 text-xs">Quality Food</p>
          </div>
        </div>
      </div>
    </div>
  );
}