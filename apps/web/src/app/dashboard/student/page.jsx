"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MessageSquare,
  Activity,
  Bot,
  BookOpen,
  Star,
  Bell,
  Phone,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

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

        if (data.user.role !== "student") {
          window.location.href = "/dashboard/teacher";
          return;
        }

        setUser(data.user);
        loadDashboardData(data.user.id);
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

  const loadDashboardData = async (userId) => {
    try {
      // Load notifications
      const notifResponse = await fetch(
        `/api/notifications/list?userId=${userId}`,
      );
      if (notifResponse.ok) {
        const notifData = await notifResponse.json();
        setNotifications(notifData.notifications || []);
      }

      // Load recent activity (upcoming appointments, recent tests, etc.)
      const activityResponse = await fetch(
        `/api/dashboard/activity?userId=${userId}`,
      );
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.activity || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bk_token");
    window.location.href = "/";
  };

  const features = [
    {
      icon: Calendar,
      title: "Buat Jadwal Konsultasi",
      description: "Jadwalkan pertemuan dengan guru BK",
      href: "/schedule",
      color: "#3A6EBB",
      bgColor: "#3A6EBB20",
    },
    {
      icon: MessageSquare,
      title: "Laporan Anonim",
      description: "Laporkan masalah secara anonim",
      href: "/report",
      color: "#F7C548",
      bgColor: "#F7C54820",
    },
    {
      icon: Activity,
      title: "Tes Tingkat Stres",
      description: "Evaluasi kondisi mental Anda",
      href: "/stress-test",
      color: "#3A6EBB",
      bgColor: "#3A6EBB20",
    },
    {
      icon: Bot,
      title: "AI Konseling Chat",
      description: "Chat dengan AI assistant",
      href: "/ai-chat",
      color: "#F7C548",
      bgColor: "#F7C54820",
    },
    {
      icon: BookOpen,
      title: "Perpustakaan Sumber Daya",
      description: "Akses artikel dan materi edukasi",
      href: "/library",
      color: "#3A6EBB",
      bgColor: "#3A6EBB20",
    },
    {
      icon: Star,
      title: "Berikan Umpan Balik",
      description: "Rating layanan konseling",
      href: "/feedback",
      color: "#F7C548",
      bgColor: "#F7C54820",
    },
  ];

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
            {/* Logo & Menu */}
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-[#333333]" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#3A6EBB] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#333333]">
                    BK Assistant
                  </h1>
                  <p className="text-sm text-[#333333]/70">Dashboard Siswa</p>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-[#333333] hover:text-[#3A6EBB] transition-colors">
                <Bell className="w-6 h-6" />
                {notifications.filter((n) => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter((n) => !n.is_read).length}
                  </span>
                )}
              </button>

              {/* Emergency */}
              <button className="p-2 text-red-500 hover:text-red-600 transition-colors">
                <Phone className="w-6 h-6" />
              </button>

              {/* User Info */}
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

              {/* Logout */}
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed left-0 top-0 h-full w-80 backdrop-filter backdrop-blur-lg bg-white/40 border-r border-white/20 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#333333]">
                Menu Navigasi
              </h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-[#333333]" />
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <a
                    key={index}
                    href={feature.href}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: feature.bgColor }}
                    >
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: feature.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-[#333333]">
                        {feature.title}
                      </p>
                      <p className="text-xs text-[#333333]/70">
                        {feature.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333333] mb-2">
            Selamat datang, {user?.fullName}!
          </h1>
          <p className="text-lg text-[#333333]/70">
            Kelola aktivitas konseling dan akses layanan yang Anda butuhkan.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#3A6EBB]/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#3A6EBB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">2</p>
                <p className="text-sm text-[#333333]/70">Jadwal Mendatang</p>
              </div>
            </div>
          </div>

          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#F7C548]/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#F7C548]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">65%</p>
                <p className="text-sm text-[#333333]/70">
                  Tingkat Stres Terakhir
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#3A6EBB]/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#3A6EBB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">12</p>
                <p className="text-sm text-[#333333]/70">Chat AI Bulan Ini</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <a
                key={index}
                href={feature.href}
                className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6 hover:bg-white/40 transition-all hover:scale-105 hover:shadow-xl group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <IconComponent
                    className="w-6 h-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="font-semibold text-[#333333] mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-[#333333]/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </a>
            );
          })}
        </div>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">
              Aktivitas Terbaru
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 backdrop-filter backdrop-blur-lg bg-white/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-[#333333]">
                    Tes stres selesai
                  </p>
                  <p className="text-xs text-[#333333]/70">2 hari yang lalu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 backdrop-filter backdrop-blur-lg bg-white/20 rounded-xl">
                <Clock className="w-5 h-5 text-[#F7C548]" />
                <div>
                  <p className="text-sm font-medium text-[#333333]">
                    Konsultasi dijadwalkan
                  </p>
                  <p className="text-xs text-[#333333]/70">Besok, 14:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 backdrop-filter backdrop-blur-lg bg-white/20 rounded-xl">
                <FileText className="w-5 h-5 text-[#3A6EBB]" />
                <div>
                  <p className="text-sm font-medium text-[#333333]">
                    Membaca artikel baru
                  </p>
                  <p className="text-xs text-[#333333]/70">3 hari yang lalu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">
              Notifikasi
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 backdrop-filter backdrop-blur-lg bg-blue-50/30 border border-blue-200/50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-[#333333]">
                    Pengingat konsultasi
                  </p>
                  <p className="text-xs text-[#333333]/70">
                    Besok jam 14:00 dengan Bu Maria
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 backdrop-filter backdrop-blur-lg bg-green-50/30 border border-green-200/50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-[#333333]">
                    Artikel baru tersedia
                  </p>
                  <p className="text-xs text-[#333333]/70">
                    Tips mengelola stres akademik
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 backdrop-filter backdrop-blur-lg bg-yellow-50/30 border border-yellow-200/50 rounded-xl">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-[#333333]">
                    Reminder tes stres
                  </p>
                  <p className="text-xs text-[#333333]/70">
                    Sudah 2 minggu sejak tes terakhir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-2xl p-6 text-center">
          <Phone className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#333333] mb-2">
            Butuh Bantuan Darurat?
          </h3>
          <p className="text-[#333333]/70 mb-4">
            Jika Anda mengalami krisis atau membutuhkan bantuan segera, hubungi:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Hotline: (021) 500-454</span>
            </button>
            <button className="border-2 border-red-500 text-red-500 px-6 py-3 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Chat Darurat</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
