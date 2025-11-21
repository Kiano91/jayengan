"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  LogOut,
  Search,
  Filter,
} from "lucide-react";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingAppointments: 0,
    completedSessions: 0,
    anonymousReports: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

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
        if (data.user.role !== "teacher") {
          window.location.href = "/dashboard/student";
          return;
        }

        setUser(data.user);
        loadDashboardData();
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

  const loadDashboardData = async () => {
    try {
      // Load dashboard statistics
      const statsResponse = await fetch("/api/dashboard/teacher/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load recent appointments
      const appointmentsResponse = await fetch("/api/appointments/recent");
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setRecentAppointments(appointmentsData.appointments || []);
      }

      // Load recent reports
      const reportsResponse = await fetch("/api/reports/recent");
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setRecentReports(reportsData.reports || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bk_token");
    window.location.href = "/";
  };

  const getAppointmentStatusColor = (status) => {
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

  const getReportPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "urgent":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC] flex items-center justify-center">
        <div className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/20 rounded-3xl p-8">
          <div className="w-8 h-8 border-4 border-[#3A6EBB]/30 border-t-[#3A6EBB] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#333333]/70 mt-4">Memuat dashboard...</p>
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
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#3A6EBB] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#333333]">
                  Dashboard Guru BK
                </h1>
                <p className="text-sm text-[#333333]/70">
                  Panel Kontrol & Analitik
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-[#3A6EBB] text-white"
                    : "text-[#333333]/70 hover:text-[#3A6EBB]"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "appointments"
                    ? "bg-[#3A6EBB] text-white"
                    : "text-[#333333]/70 hover:text-[#3A6EBB]"
                }`}
              >
                Jadwal
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "reports"
                    ? "bg-[#3A6EBB] text-white"
                    : "text-[#333333]/70 hover:text-[#3A6EBB]"
                }`}
              >
                Laporan
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#333333] hover:text-[#3A6EBB] transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.pendingAppointments > 0
                    ? stats.pendingAppointments
                    : ""}
                </span>
              </button>

              <button className="p-2 text-red-500 hover:text-red-600 transition-colors">
                <Phone className="w-6 h-6" />
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#333333]">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-[#333333]/70">Guru BK</p>
                </div>
                <div className="w-8 h-8 bg-[#F7C548] rounded-full flex items-center justify-center">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-2">
                Selamat Datang, {user?.full_name}
              </h2>
              <p className="text-[#333333]/70">
                Berikut adalah ringkasan aktivitas bimbingan konseling hari ini
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#333333] mb-1">
                  {stats.totalStudents}
                </h3>
                <p className="text-sm text-[#333333]/70">
                  Total Siswa Terlayani
                </p>
              </div>

              <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#333333] mb-1">
                  {stats.pendingAppointments}
                </h3>
                <p className="text-sm text-[#333333]/70">Jadwal Menunggu</p>
              </div>

              <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#333333] mb-1">
                  {stats.completedSessions}
                </h3>
                <p className="text-sm text-[#333333]/70">Sesi Selesai</p>
              </div>

              <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-red-600" />
                  </div>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#333333] mb-1">
                  {stats.anonymousReports}
                </h3>
                <p className="text-sm text-[#333333]/70">Laporan Baru</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-6 hover:bg-white/40 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-[#3A6EBB] rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#333333] mb-2">
                  Kelola Jadwal
                </h3>
                <p className="text-sm text-[#333333]/70 mb-4">
                  Konfirmasi dan kelola jadwal konsultasi siswa
                </p>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className="text-[#3A6EBB] font-medium text-sm hover:underline"
                >
                  Lihat Jadwal →
                </button>
              </div>

              <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-6 hover:bg-white/40 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-[#F7C548] rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#333333] mb-2">
                  Review Laporan
                </h3>
                <p className="text-sm text-[#333333]/70 mb-4">
                  Tinjau laporan anonim yang masuk
                </p>
                <button
                  onClick={() => setActiveTab("reports")}
                  className="text-[#F7C548] font-medium text-sm hover:underline"
                >
                  Lihat Laporan →
                </button>
              </div>

              <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-6 hover:bg-white/40 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#333333] mb-2">
                  Analitik & Laporan
                </h3>
                <p className="text-sm text-[#333333]/70 mb-4">
                  Lihat statistik dan tren konseling
                </p>
                <button className="text-green-500 font-medium text-sm hover:underline">
                  Lihat Analytics →
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "appointments" && (
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#333333]">
                Jadwal Konsultasi
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#333333]/50" />
                  <input
                    type="text"
                    placeholder="Cari siswa..."
                    className="pl-10 pr-4 py-2 rounded-lg backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6EBB]"
                  />
                </div>
                <button className="p-2 text-[#333333] hover:text-[#3A6EBB] transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {recentAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-[#333333]/30 mx-auto mb-4" />
                  <p className="text-[#333333]/70">
                    Tidak ada jadwal konsultasi
                  </p>
                </div>
              ) : (
                recentAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-[#333333] text-lg">
                          {appointment.student_name}
                        </h3>
                        <p className="text-[#333333]/70 text-sm">
                          Kelas {appointment.student_class}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-[#333333]/70 mb-1">
                          Tanggal & Waktu
                        </p>
                        <p className="font-medium text-[#333333]">
                          {new Date(
                            appointment.scheduled_date,
                          ).toLocaleDateString("id-ID")}{" "}
                          - {appointment.scheduled_time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#333333]/70 mb-1">Alasan</p>
                        <p className="font-medium text-[#333333]">
                          {appointment.reason}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#333333]/70 mb-1">Durasi</p>
                        <p className="font-medium text-[#333333]">
                          {appointment.duration_minutes} menit
                        </p>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-[#333333]/70 mb-1">
                          Catatan Siswa
                        </p>
                        <p className="text-sm text-[#333333] bg-white/20 rounded-lg p-3">
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      {appointment.status === "pending" && (
                        <>
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                            Konfirmasi
                          </button>
                          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                            Tolak
                          </button>
                        </>
                      )}
                      <button className="px-4 py-2 bg-[#3A6EBB] text-white rounded-lg hover:bg-[#3A6EBB]/90 transition-colors text-sm">
                        Detail
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#333333]">
                Laporan Anonim
              </h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 rounded-lg backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3A6EBB]">
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select className="px-4 py-2 rounded-lg backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3A6EBB]">
                  <option value="">Semua Prioritas</option>
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {recentReports.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-[#333333]/30 mx-auto mb-4" />
                  <p className="text-[#333333]/70">Tidak ada laporan baru</p>
                </div>
              ) : (
                recentReports.map((report, index) => (
                  <div
                    key={index}
                    className="backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#333333] text-lg mb-2">
                          {report.title}
                        </h3>
                        <p className="text-[#333333]/70 text-sm">
                          {report.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getReportPriorityColor(report.priority)}`}
                        >
                          {report.priority}
                        </span>
                        <span className="text-xs text-[#333333]/50">
                          {new Date(report.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm font-medium text-[#333333]/70">
                        Kategori:{" "}
                      </span>
                      <span className="text-sm text-[#333333]">
                        {report.category}
                      </span>
                    </div>

                    {report.attachment_url && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-[#333333]/70">
                          Lampiran:{" "}
                        </span>
                        <a
                          href={report.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#3A6EBB] hover:underline"
                        >
                          Lihat File
                        </a>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === "pending"
                            ? "text-yellow-600 bg-yellow-100"
                            : report.status === "reviewed"
                              ? "text-blue-600 bg-blue-100"
                              : "text-green-600 bg-green-100"
                        }`}
                      >
                        {report.status === "pending"
                          ? "Menunggu Review"
                          : report.status === "reviewed"
                            ? "Sudah Review"
                            : "Selesai"}
                      </span>

                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-[#3A6EBB] text-white rounded-lg hover:bg-[#3A6EBB]/90 transition-colors text-sm">
                          Review
                        </button>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                          Selesaikan
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Emergency Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-2xl p-6 text-center">
          <Phone className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333333] mb-2">
            Emergency Protocol
          </h3>
          <p className="text-[#333333]/70 mb-4">
            Untuk situasi krisis atau emergency, hubungi koordinator BK atau
            kepala sekolah
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all">
              Emergency Line: (021) 500-454
            </button>
            <button className="border-2 border-red-500 text-red-500 px-6 py-3 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all">
              Koordinator BK: Ext 123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
