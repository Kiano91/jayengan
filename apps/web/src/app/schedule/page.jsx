"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
  Phone,
  Bell,
  LogOut,
} from "lucide-react";

export default function SchedulePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Verify token and get user data
    const token = localStorage.getItem("bk_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          localStorage.removeItem("bk_token");
          window.location.href = "/login";
          return;
        }

        const data = await response.json();
        setUser(data.user);
        loadAppointments(data.user.id);
      } catch (error) {
        console.error("Verification error:", error);
        localStorage.removeItem("bk_token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const loadAppointments = async (userId) => {
    try {
      const response = await fetch(`/api/appointments/list?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("bk_token");
      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Jadwal konsultasi berhasil dibuat! Anda akan menerima konfirmasi dari guru BK.",
        });
        setFormData({ date: "", time: "", reason: "", notes: "" });
        loadAppointments(user.id);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Terjadi kesalahan saat membuat jadwal",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus({
        type: "error",
        message: "Terjadi kesalahan sistem. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bk_token");
    window.location.href = "/";
  };

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const reasons = [
    "Konsultasi akademik",
    "Masalah personal",
    "Perencanaan karir",
    "Masalah sosial",
    "Konseling kesehatan mental",
    "Lainnya",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "confirmed":
        return "Dikonfirmasi";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC] flex items-center justify-center">
        <div className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/20 rounded-3xl p-8">
          <div className="w-8 h-8 border-4 border-[#3A6EBB]/30 border-t-[#3A6EBB] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#333333]/70 mt-4">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC]">
      {/* Navigation Header */}
      <nav className="backdrop-filter backdrop-blur-lg bg-white/30 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo & Back Button */}
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard/student"
                className="p-2 text-[#333333] hover:text-[#3A6EBB] transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </a>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#3A6EBB] rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#333333]">
                    Penjadwalan Konsultasi
                  </h1>
                  <p className="text-sm text-[#333333]/70">
                    Buat jadwal dengan guru BK
                  </p>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#333333] hover:text-[#3A6EBB] transition-colors">
                <Bell className="w-6 h-6" />
              </button>

              <button className="p-2 text-red-500 hover:text-red-600 transition-colors">
                <Phone className="w-6 h-6" />
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#333333]">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-[#333333]/70">
                    Kelas {user?.class}
                  </p>
                </div>
                <div className="w-8 h-8 bg-[#3A6EBB] rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-[#333333] hover:text-red-500 transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">
              Buat Jadwal Baru
            </h2>

            {submitStatus && (
              <div
                className={`p-4 rounded-xl mb-6 ${
                  submitStatus.type === "success"
                    ? "bg-green-50/50 border border-green-200 text-green-800"
                    : "bg-red-50/50 border border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{submitStatus.message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Pilih Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Pilih Waktu
                </label>
                <select
                  required
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent"
                >
                  <option value="">Pilih waktu</option>
                  {timeSlots.map((time) => (
                    <option
                      key={time}
                      value={time}
                      className="bg-white text-[#333333]"
                    >
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Alasan Konsultasi
                </label>
                <select
                  required
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent"
                >
                  <option value="">Pilih alasan</option>
                  {reasons.map((reason) => (
                    <option
                      key={reason}
                      value={reason}
                      className="bg-white text-[#333333]"
                    >
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Jelaskan secara singkat hal yang ingin dikonsultasikan..."
                  className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#3A6EBB] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#3A6EBB]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Permintaan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Appointments History */}
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">
              Riwayat Jadwal
            </h2>

            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-[#333333]/30 mx-auto mb-4" />
                  <p className="text-[#333333]/70">
                    Belum ada jadwal konsultasi
                  </p>
                </div>
              ) : (
                appointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-[#333333]">
                          {appointment.reason}
                        </h3>
                        <p className="text-sm text-[#333333]/70">
                          {new Date(
                            appointment.scheduled_date,
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-[#333333]/70">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.scheduled_time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Guru BK</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <p className="mt-3 text-sm text-[#333333]/70 bg-white/20 rounded-lg p-3">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 backdrop-filter backdrop-blur-lg bg-blue-50/30 border border-blue-200/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-3">
            Informasi Penting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#333333]/70">
            <div>
              <h4 className="font-medium text-[#333333] mb-2">
                Jam Operasional
              </h4>
              <p>Senin - Jumat: 08:00 - 16:00</p>
              <p>Sabtu: 08:00 - 12:00</p>
              <p>Minggu: Tutup</p>
            </div>
            <div>
              <h4 className="font-medium text-[#333333] mb-2">Catatan</h4>
              <p>• Konfirmasi akan dikirim maksimal 24 jam</p>
              <p>• Bisa membatalkan maksimal 2 jam sebelum jadwal</p>
              <p>• Untuk emergency, hubungi langsung</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-2xl p-6 text-center">
          <Phone className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333333] mb-2">
            Butuh Bantuan Darurat?
          </h3>
          <p className="text-[#333333]/70 mb-4">
            Untuk situasi krisis atau butuh bantuan segera:
          </p>
          <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all flex items-center justify-center space-x-2 mx-auto">
            <Phone className="w-5 h-5" />
            <span>Hotline: (021) 500-454</span>
          </button>
        </div>
      </main>
    </div>
  );
}
