"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Upload,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
  Phone,
  Bell,
  LogOut,
  Users,
  Shield,
  Lock,
} from "lucide-react";

export default function ReportPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    attachment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);

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

  const handleFileUpload = (file) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setSubmitStatus({
        type: "error",
        message: "File terlalu besar. Maksimal 10MB.",
      });
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      setSubmitStatus({
        type: "error",
        message:
          "Format file tidak didukung. Gunakan JPG, PNG, GIF, PDF, atau TXT.",
      });
      return;
    }

    setFormData({ ...formData, attachment: file });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  const removeAttachment = () => {
    setFormData({ ...formData, attachment: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("bk_token");

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("token", token);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);

      if (formData.attachment) {
        submitData.append("attachment", formData.attachment);
      }

      const response = await fetch("/api/reports/create", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Laporan berhasil dikirim secara anonim. Terima kasih atas kepercayaan Anda. Tim BK akan menindaklanjuti.",
        });
        setFormData({
          title: "",
          description: "",
          category: "",
          attachment: null,
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Terjadi kesalahan saat mengirim laporan",
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

  const categories = [
    "Perundungan/Bullying",
    "Kekerasan fisik",
    "Pelecehan verbal",
    "Cyberbullying",
    "Diskriminasi",
    "Ancaman",
    "Perilaku tidak pantas guru/staff",
    "Masalah fasilitas sekolah",
    "Lainnya",
  ];

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
                <div className="w-10 h-10 bg-[#F7C548] rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#333333]">
                    Laporan Anonim
                  </h1>
                  <p className="text-sm text-[#333333]/70">
                    Laporkan masalah secara aman
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Privacy Notice */}
        <div className="backdrop-filter backdrop-blur-lg bg-blue-50/30 border border-blue-200/50 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Shield className="w-8 h-8 text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Jaminan Privasi & Keamanan
              </h3>
              <div className="text-sm text-[#333333]/70 space-y-2">
                <p>
                  • <strong>100% Anonim</strong> - Identitas Anda tidak akan
                  diketahui siapapun
                </p>
                <p>
                  • <strong>Data Terenkripsi</strong> - Laporan Anda diamankan
                  dengan enkripsi tingkat tinggi
                </p>
                <p>
                  • <strong>Akses Terbatas</strong> - Hanya guru BK yang dapat
                  melihat laporan
                </p>
                <p>
                  • <strong>Tidak Ada Jejak</strong> - Tidak ada catatan yang
                  menghubungkan laporan dengan akun Anda
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="w-6 h-6 text-[#F7C548]" />
            <h2 className="text-2xl font-bold text-[#333333]">
              Buat Laporan Anonim
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
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Judul Laporan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ringkasan singkat masalah yang ingin dilaporkan"
                className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:ring-2 focus:ring-[#F7C548] focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Kategori Masalah <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#F7C548] focus:border-transparent"
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-white text-[#333333]"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Deskripsi Detail <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Jelaskan secara detail masalah yang terjadi. Semakin lengkap informasi yang Anda berikan, semakin baik tim BK dapat membantu menyelesaikan masalah ini."
                className="w-full px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:ring-2 focus:ring-[#F7C548] focus:border-transparent resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Lampiran (Opsional)
              </label>
              <p className="text-xs text-[#333333]/60 mb-3">
                Format yang didukung: JPG, PNG, GIF, PDF, TXT (Maksimal 10MB)
              </p>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver
                    ? "border-[#F7C548] bg-[#F7C548]/10"
                    : "border-white/30 bg-white/10"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
              >
                {formData.attachment ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="w-8 h-8 text-[#F7C548]" />
                    <div className="text-left">
                      <p className="font-medium text-[#333333]">
                        {formData.attachment.name}
                      </p>
                      <p className="text-sm text-[#333333]/70">
                        {(formData.attachment.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-[#333333]/40 mx-auto mb-4" />
                    <p className="text-[#333333]/70 mb-2">
                      Drag & drop file di sini atau{" "}
                      <span className="text-[#F7C548] font-medium">browse</span>
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.txt"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-[#F7C548] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#F7C548]/90 transition-colors inline-block"
                    >
                      Pilih File
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F7C548] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#F7C548]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Mengirim laporan...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Kirim Laporan Anonim</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">
            Panduan Membuat Laporan yang Efektif
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#333333]/70">
            <div>
              <h4 className="font-medium text-[#333333] mb-2">
                Yang Sebaiknya Disertakan:
              </h4>
              <ul className="space-y-1">
                <li>• Tanggal dan waktu kejadian</li>
                <li>• Lokasi kejadian (kelas, koridor, dll)</li>
                <li>• Pihak-pihak yang terlibat</li>
                <li>• Saksi yang melihat (jika ada)</li>
                <li>• Kronologi lengkap kejadian</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#333333] mb-2">
                Tips Keamanan:
              </h4>
              <ul className="space-y-1">
                <li>• Gunakan komputer/HP pribadi</li>
                <li>• Jangan akses dari perangkat sekolah</li>
                <li>• Hapus riwayat browser setelah selesai</li>
                <li>• Jangan ceritakan ke orang lain</li>
                <li>• Simpan bukti di tempat aman</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-2xl p-6 text-center">
          <Phone className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333333] mb-2">
            Situasi Darurat?
          </h3>
          <p className="text-[#333333]/70 mb-4">
            Jika Anda dalam bahaya segera atau membutuhkan bantuan mendesak:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Hotline: (021) 500-454</span>
            </button>
            <button className="border-2 border-red-500 text-red-500 px-6 py-3 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Chat Darurat</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
