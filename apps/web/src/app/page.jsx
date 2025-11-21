import {
  Calendar,
  MessageSquare,
  Activity,
  FileText,
  Bot,
  BookOpen,
  BarChart3,
  Star,
  Bell,
  Phone,
  Users,
  Shield,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Penjadwalan Pertemuan",
      description:
        "Buat jadwal konsultasi dengan guru BK sesuai kebutuhan Anda",
      color: "#3A6EBB",
    },
    {
      icon: MessageSquare,
      title: "Laporan Anonim",
      description:
        "Laporkan masalah perundungan atau isu lainnya secara anonim",
      color: "#F7C548",
    },
    {
      icon: Activity,
      title: "Tes Tingkat Stres",
      description:
        "Evaluasi kondisi mental dan tingkat stres Anda dengan tes komprehensif",
      color: "#3A6EBB",
    },
    {
      icon: Bot,
      title: "AI Konseling Chat",
      description:
        "Konsultasi awal dengan AI assistant untuk panduan dan dukungan",
      color: "#F7C548",
    },
    {
      icon: BookOpen,
      title: "Perpustakaan Sumber Daya",
      description:
        "Akses artikel, video, dan materi edukasi tentang kesehatan mental",
      color: "#3A6EBB",
    },
    {
      icon: BarChart3,
      title: "Dashboard Analitik",
      description: "Pantau progress dan statistik konseling (khusus guru BK)",
      color: "#F7C548",
    },
    {
      icon: Star,
      title: "Sistem Umpan Balik",
      description: "Berikan rating dan komentar untuk meningkatkan layanan",
      color: "#3A6EBB",
    },
    {
      icon: Phone,
      title: "Kontak Darurat",
      description: "Akses cepat ke hotline konseling saat situasi krisis",
      color: "#F7C548",
    },
  ];

  return (
    <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC]">
      {/* Navigation Header */}
      <nav className="relative">
        <div className="backdrop-filter backdrop-blur-lg bg-white/30 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#3A6EBB] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#333333]">
                    BK Assistant
                  </h1>
                  <p className="text-sm text-[#333333]/70">
                    Bimbingan Konseling Digital
                  </p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="/"
                  className="text-[#333333] hover:text-[#3A6EBB] transition-colors font-medium"
                >
                  Beranda
                </a>
                <a
                  href="/features"
                  className="text-[#333333]/70 hover:text-[#3A6EBB] transition-colors"
                >
                  Fitur
                </a>
                <a
                  href="/about"
                  className="text-[#333333]/70 hover:text-[#3A6EBB] transition-colors"
                >
                  Tentang
                </a>
                <a
                  href="/contact"
                  className="text-[#333333]/70 hover:text-[#3A6EBB] transition-colors"
                >
                  Kontak
                </a>
              </div>

              {/* Login Button */}
              <div className="hidden md:flex items-center space-x-4">
                <a
                  href="/login"
                  className="bg-[#3A6EBB] text-white px-6 py-2 rounded-full font-medium hover:bg-[#3A6EBB]/90 transition-colors flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </a>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden backdrop-filter backdrop-blur-lg bg-white/40 border-t border-white/20">
              <div className="px-4 py-4 space-y-4">
                <a href="/" className="block text-[#333333] font-medium">
                  Beranda
                </a>
                <a href="/features" className="block text-[#333333]/70">
                  Fitur
                </a>
                <a href="/about" className="block text-[#333333]/70">
                  Tentang
                </a>
                <a href="/contact" className="block text-[#333333]/70">
                  Kontak
                </a>
                <a
                  href="/login"
                  className="w-full bg-[#3A6EBB] text-white px-6 py-2 rounded-full font-medium flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#333333] mb-6 leading-tight">
            Platform Bimbingan Konseling
            <span className="text-[#3A6EBB]"> Digital</span>
          </h1>
          <p className="text-lg md:text-xl text-[#333333]/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Solusi komprehensif untuk layanan bimbingan konseling SMA dengan
            teknologi AI, sistem manajemen yang terintegrasi, dan dukungan 24/7
            untuk kesejahteraan siswa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/login"
              className="bg-[#3A6EBB] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#3A6EBB]/90 transition-all hover:scale-105 flex items-center space-x-2 min-w-48"
            >
              <LogIn className="w-5 h-5" />
              <span>Mulai Sekarang</span>
            </a>
            <a
              href="#emergency"
              className="border-2 border-[#3A6EBB] text-[#3A6EBB] px-8 py-4 rounded-full font-semibold hover:bg-[#3A6EBB] hover:text-white transition-all hover:scale-105 flex items-center space-x-2 min-w-48"
            >
              <Phone className="w-5 h-5" />
              <span>Kontak Darurat</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Fitur Lengkap untuk Konseling Modern
            </h2>
            <p className="text-lg text-[#333333]/70 max-w-2xl mx-auto">
              Platform yang dirancang khusus untuk memenuhi kebutuhan konseling
              siswa SMA dengan teknologi terdepan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6 hover:bg-white/40 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}20` }}
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#3A6EBB] mb-2">
                  1000+
                </div>
                <div className="text-[#333333]/70">Siswa Terlayani</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#F7C548] mb-2">
                  95%
                </div>
                <div className="text-[#333333]/70">Tingkat Kepuasan</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#3A6EBB] mb-2">
                  24/7
                </div>
                <div className="text-[#333333]/70">Dukungan AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-3xl p-8 md:p-12">
            <Phone className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
              Butuh Bantuan Segera?
            </h2>
            <p className="text-lg text-[#333333]/70 mb-6">
              Jika Anda mengalami krisis atau membutuhkan bantuan darurat,
              jangan ragu untuk menghubungi layanan konseling darurat kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-600 transition-all flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Hotline: (021) 500-454</span>
              </button>
              <button className="border-2 border-red-500 text-red-500 px-8 py-4 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Chat Darurat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 backdrop-filter backdrop-blur-lg bg-white/20 border-t border-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-[#3A6EBB] rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-[#333333]">
                  BK Assistant
                </span>
              </div>
              <p className="text-[#333333]/70 text-sm">
                Platform konseling digital untuk mendukung kesejahteraan mental
                siswa SMA.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#333333] mb-4">Fitur</h4>
              <ul className="space-y-2 text-sm text-[#333333]/70">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#3A6EBB] transition-colors"
                  >
                    Penjadwalan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#3A6EBB] transition-colors"
                  >
                    Laporan Anonim
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#3A6EBB] transition-colors"
                  >
                    Tes Stres
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#3A6EBB] transition-colors"
                  >
                    AI Chat
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#333333] mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm text-[#333333]/70">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#3A6EBB] transition-colors"
                  >
                    Panduan Pengguna
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#3A6EBB] transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#3A6EBB] transition-colors"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#3A6EBB] transition-colors"
                  >
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#333333] mb-4">Darurat</h4>
              <div className="space-y-2 text-sm text-[#333333]/70">
                <p>Hotline 24/7:</p>
                <p className="font-semibold text-[#3A6EBB]">(021) 500-454</p>
                <p>Email: darurat@bkassistant.edu</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#333333]/70">
              <p>&copy; 2024 BK Assistant. Semua hak dilindungi.</p>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Shield className="w-4 h-4" />
                <span>Data Anda Aman & Terenkripsi</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
