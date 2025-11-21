"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Phone,
  Bell,
  LogOut,
  Users,
  Heart,
  Calendar,
  Clock,
} from "lucide-react";

export default function FeedbackPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    appointmentId: "",
    rating: 0,
    comment: "",
    suggestions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [previousFeedback, setPreviousFeedback] = useState([]);

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
        loadPreviousFeedback(data.user.id);
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
      const response = await fetch(
        `/api/appointments/completed?userId=${userId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  const loadPreviousFeedback = async (userId) => {
    try {
      const response = await fetch(`/api/feedback/list?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPreviousFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error("Error loading feedback:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (formData.rating === 0) {
      setSubmitStatus({
        type: "error",
        message: "Silakan berikan rating terlebih dahulu",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("bk_token");
      const response = await fetch("/api/feedback/create", {
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
            "Terima kasih! Umpan balik Anda sangat berharga untuk meningkatkan kualitas layanan konseling.",
        });
        setFormData({
          appointmentId: "",
          rating: 0,
          comment: "",
          suggestions: "",
        });
        loadPreviousFeedback(user.id);
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.error || "Terjadi kesalahan saat mengirim umpan balik",
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

  const StarRating = ({ rating, onRatingChange, size = "w-8 h-8" }) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-colors"
          >
            <Star
              className={`${size} ${
                star <= rating
                  ? "text-[#F7C548] fill-[#F7C548]"
                  : "text-gray-300 hover:text-[#F7C548]"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Sangat Tidak Puas";
      case 2:
        return "Tidak Puas";
      case 3:
        return "Cukup";
      case 4:
        return "Puas";
      case 5:
        return "Sangat Puas";
      default:
        return "Pilih Rating";
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
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#333333]">
                    Umpan Balik
                  </h1>
                  <p className="text-sm text-[#333333]/70">
                    Bantu kami meningkatkan layanan
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
          {/* Feedback Form */}
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="w-6 h-6 text-[#3A6EBB]" />
              <h2 className="text-2xl font-bold text-[#333333]">
                Berikan Umpan Balik
              </h2>
            </div>

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
              {/* Appointment Selection */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Pilih Sesi Konseling (Opsional)
                </label>
                <select
                  value={formData.appointmentId}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent"
                >
                  <option value="">
                    Umpan balik umum (bukan untuk sesi tertentu)
                  </option>
                  {appointments.map((appointment) => (
                    <option
                      key={appointment.id}
                      value={appointment.id}
                      className="bg-white text-[#333333]"
                    >
                      {appointment.reason} -{" "}
                      {new Date(appointment.scheduled_date).toLocaleDateString(
                        "id-ID",
                      )}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-3">
                  Rating Kepuasan <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={(rating) =>
                      setFormData({ ...formData, rating })
                    }
                  />
                  <p className="text-sm text-[#333333]/70">
                    {getRatingText(formData.rating)}
                  </p>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Komentar <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Bagikan pengalaman Anda dengan layanan konseling..."
                  className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent resize-none"
                />
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">
                  Saran Perbaikan (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={formData.suggestions}
                  onChange={(e) =>
                    setFormData({ ...formData, suggestions: e.target.value })
                  }
                  placeholder="Apa yang bisa ditingkatkan dari layanan ini?"
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
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Umpan Balik</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Previous Feedback */}
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">
              Riwayat Umpan Balik
            </h2>

            <div className="space-y-4">
              {previousFeedback.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-[#333333]/30 mx-auto mb-4" />
                  <p className="text-[#333333]/70">
                    Belum ada umpan balik yang diberikan
                  </p>
                </div>
              ) : (
                previousFeedback.map((feedback, index) => (
                  <div
                    key={index}
                    className="backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <StarRating
                          rating={feedback.rating}
                          onRatingChange={() => {}}
                          size="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-[#333333]">
                          {getRatingText(feedback.rating)}
                        </span>
                      </div>
                      <span className="text-xs text-[#333333]/60">
                        {new Date(feedback.created_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                    </div>

                    {feedback.comment && (
                      <p className="text-sm text-[#333333]/70 mb-2 bg-white/20 rounded-lg p-3">
                        {feedback.comment}
                      </p>
                    )}

                    {feedback.suggestions && (
                      <div className="text-xs text-[#333333]/60">
                        <strong>Saran:</strong> {feedback.suggestions}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mt-8 backdrop-filter backdrop-blur-lg bg-green-50/30 border border-green-200/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">
            Dampak Umpan Balik Anda
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#333333]/70">
            <div className="flex items-start space-x-3">
              <ThumbsUp className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium text-[#333333] mb-1">
                  Meningkatkan Kualitas
                </h4>
                <p>
                  Setiap masukan membantu kami memberikan layanan konseling yang
                  lebih baik
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h4 className="font-medium text-[#333333] mb-1">
                  Membantu Siswa Lain
                </h4>
                <p>
                  Saran Anda berkontribusi pada pengalaman positif siswa lainnya
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <h4 className="font-medium text-[#333333] mb-1">
                  Apresiasi Guru BK
                </h4>
                <p>
                  Feedback positif memotivasi guru BK untuk terus memberikan
                  yang terbaik
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Statistics */}
        <div className="mt-6 backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">
            Statistik Kepuasan Siswa
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#3A6EBB] mb-1">95%</div>
              <div className="text-xs text-[#333333]/70">Tingkat Kepuasan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F7C548] mb-1">4.8</div>
              <div className="text-xs text-[#333333]/70">Rating Rata-rata</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#3A6EBB] mb-1">248</div>
              <div className="text-xs text-[#333333]/70">
                Feedback Bulan Ini
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F7C548] mb-1">89%</div>
              <div className="text-xs text-[#333333]/70">
                Akan Merekomendasikan
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-2xl p-6 text-center">
          <Phone className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333333] mb-2">
            Butuh Bantuan Segera?
          </h3>
          <p className="text-[#333333]/70 mb-4">
            Jika Anda membutuhkan konseling darurat atau bantuan segera:
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
