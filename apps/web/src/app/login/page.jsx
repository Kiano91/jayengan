"use client";

import { useState } from "react";
import { LogIn, Users, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();

      // Store token in localStorage
      localStorage.setItem("bk_token", data.token);

      // Redirect based on role
      if (data.user.role === "teacher") {
        window.location.href = "/dashboard/teacher";
      } else {
        window.location.href = "/dashboard/student";
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fillDemoAccount = (username, password) => {
    setFormData({ username, password });
  };

  return (
    <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC] flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3A6EBB]/10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F7C548]/10 rounded-full"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/20 rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#3A6EBB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#333333] mb-2">
              Masuk ke BK Assistant
            </h1>
            <p className="text-[#333333]/70">
              Platform Bimbingan Konseling Digital
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 backdrop-filter backdrop-blur-lg bg-red-50/50 border border-red-200/50 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#333333] mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 backdrop-filter backdrop-blur-lg bg-white/30 border border-white/40 rounded-xl focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent outline-none transition-all placeholder-[#333333]/50"
                placeholder="Masukkan username Anda"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#333333] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 backdrop-filter backdrop-blur-lg bg-white/30 border border-white/40 rounded-xl focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent outline-none transition-all placeholder-[#333333]/50"
                  placeholder="Masukkan password Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#333333]/50 hover:text-[#333333] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3A6EBB] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#3A6EBB]/90 focus:ring-2 focus:ring-[#3A6EBB] focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts Info */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center mb-4">
              <p className="text-sm text-[#333333]/70">
                Akun Demo untuk Testing:
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => fillDemoAccount("siswa001", "password123")}
                className="w-full backdrop-filter backdrop-blur-lg bg-[#3A6EBB]/10 border border-[#3A6EBB]/20 rounded-lg p-3 hover:bg-[#3A6EBB]/20 transition-colors"
              >
                <p className="text-sm font-medium text-[#333333] mb-1">
                  Akun Siswa:
                </p>
                <p className="text-xs text-[#333333]/70">
                  Username: siswa001 | Password: password123
                </p>
              </button>

              <button
                onClick={() => fillDemoAccount("guru.bk", "password123")}
                className="w-full backdrop-filter backdrop-blur-lg bg-[#F7C548]/10 border border-[#F7C548]/20 rounded-lg p-3 hover:bg-[#F7C548]/20 transition-colors"
              >
                <p className="text-sm font-medium text-[#333333] mb-1">
                  Akun Guru BK:
                </p>
                <p className="text-xs text-[#333333]/70">
                  Username: guru.bk | Password: password123
                </p>
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-[#3A6EBB] hover:text-[#3A6EBB]/80 transition-colors"
            >
              ← Kembali ke Beranda
            </a>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-2xl p-4 text-center">
          <p className="text-sm text-[#333333]/70 mb-2">
            Butuh bantuan darurat?
          </p>
          <p className="text-sm font-semibold text-red-600">
            Hotline: (021) 500-454
          </p>
        </div>
      </div>
    </div>
  );
}
