"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  ArrowLeft,
  Eye,
  Download,
  ExternalLink,
  Filter,
  Tag,
  Calendar,
  Star,
  Play,
  FileText,
  Phone,
  Bell,
  LogOut,
  Users,
  Heart,
  TrendingUp,
} from "lucide-react";

export default function LibraryPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [filteredResources, setFilteredResources] = useState([]);

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
        loadResources();
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

  // Sample resources data (would come from API in real app)
  const loadResources = () => {
    const sampleResources = [
      {
        id: 1,
        title: "Mengelola Stres Akademik",
        description:
          "Panduan praktis untuk mengatasi tekanan belajar dan ujian",
        content_type: "article",
        category: "Kesehatan Mental",
        tags: ["stres", "akademik", "coping"],
        is_featured: true,
        view_count: 245,
        created_at: "2024-01-15",
        content_url: null,
        thumbnail: null,
      },
      {
        id: 2,
        title: "Teknik Pernapasan untuk Relaksasi",
        description:
          "Video tutorial teknik pernapasan untuk menenangkan pikiran",
        content_type: "video",
        category: "Teknik Relaksasi",
        tags: ["pernapasan", "relaksasi", "mindfulness"],
        is_featured: true,
        view_count: 189,
        created_at: "2024-01-12",
        content_url: "https://youtube.com/watch?v=example",
        thumbnail: null,
      },
      {
        id: 3,
        title: "Panduan Anti-Bullying",
        description:
          "Dokumen lengkap tentang pencegahan dan penanganan perundungan",
        content_type: "document",
        category: "Anti-Bullying",
        tags: ["bullying", "pencegahan", "keamanan"],
        is_featured: false,
        view_count: 156,
        created_at: "2024-01-10",
        content_url: "/docs/anti-bullying-guide.pdf",
        thumbnail: null,
      },
      {
        id: 4,
        title: "Membangun Kepercayaan Diri",
        description:
          "Artikel tentang cara membangun dan meningkatkan kepercayaan diri",
        content_type: "article",
        category: "Pengembangan Diri",
        tags: ["kepercayaan diri", "motivasi", "psikologi"],
        is_featured: false,
        view_count: 198,
        created_at: "2024-01-08",
        content_url: null,
        thumbnail: null,
      },
      {
        id: 5,
        title: "Konseling Kelompok - Webinar",
        description: "Recording webinar tentang manfaat konseling kelompok",
        content_type: "video",
        category: "Konseling",
        tags: ["kelompok", "terapi", "komunikasi"],
        is_featured: false,
        view_count: 87,
        created_at: "2024-01-05",
        content_url: "https://youtube.com/watch?v=example2",
        thumbnail: null,
      },
      {
        id: 6,
        title: "Mengatasi Anxiety pada Remaja",
        description: "Panduan khusus untuk remaja yang mengalami kecemasan",
        content_type: "article",
        category: "Kesehatan Mental",
        tags: ["anxiety", "remaja", "kecemasan"],
        is_featured: true,
        view_count: 312,
        created_at: "2024-01-03",
        content_url: null,
        thumbnail: null,
      },
    ];
    setResources(sampleResources);
    setFilteredResources(sampleResources);
  };

  useEffect(() => {
    // Filter resources based on search and filters
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (resource) => resource.category === selectedCategory,
      );
    }

    if (selectedContentType !== "all") {
      filtered = filtered.filter(
        (resource) => resource.content_type === selectedContentType,
      );
    }

    setFilteredResources(filtered);
  }, [searchQuery, selectedCategory, selectedContentType, resources]);

  const handleLogout = () => {
    localStorage.removeItem("bk_token");
    window.location.href = "/";
  };

  const handleResourceClick = (resource) => {
    // Track view count (would make API call in real app)
    if (resource.content_type === "video" && resource.content_url) {
      window.open(resource.content_url, "_blank");
    } else if (resource.content_type === "document" && resource.content_url) {
      window.open(resource.content_url, "_blank");
    } else {
      // For articles, we could navigate to a detailed view
      alert(`Membuka: ${resource.title}\n\n${resource.description}`);
    }
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <Play className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      case "article":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getContentTypeColor = (contentType) => {
    switch (contentType) {
      case "video":
        return "text-red-600 bg-red-100";
      case "document":
        return "text-blue-600 bg-blue-100";
      case "article":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const categories = [
    "Kesehatan Mental",
    "Anti-Bullying",
    "Pengembangan Diri",
    "Teknik Relaksasi",
    "Konseling",
    "Akademik",
  ];

  const contentTypes = [
    { value: "article", label: "Artikel" },
    { value: "video", label: "Video" },
    { value: "document", label: "Dokumen" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC] flex items-center justify-center">
        <div className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/20 rounded-3xl p-8">
          <div className="w-8 h-8 border-4 border-[#3A6EBB]/30 border-t-[#3A6EBB] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#333333]/70 mt-4">Memuat perpustakaan...</p>
        </div>
      </div>
    );
  }

  const featuredResources = filteredResources.filter((r) => r.is_featured);
  const regularResources = filteredResources.filter((r) => !r.is_featured);

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
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#333333]">
                    Perpustakaan Sumber Daya
                  </h1>
                  <p className="text-sm text-[#333333]/70">
                    Materi edukasi kesehatan mental
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#333333]/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari artikel, video, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent min-w-48"
            >
              <option value="all">Semua Kategori</option>
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

            {/* Content Type Filter */}
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              className="px-4 py-3 rounded-xl backdrop-filter backdrop-blur-lg bg-white/20 border border-white/20 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent min-w-40"
            >
              <option value="all">Semua Tipe</option>
              {contentTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                  className="bg-white text-[#333333]"
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-[#333333]/70">
            Menampilkan {filteredResources.length} dari {resources.length}{" "}
            sumber daya
          </div>
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="w-6 h-6 text-[#F7C548]" />
              <h2 className="text-2xl font-bold text-[#333333]">
                Sumber Daya Unggulan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <div
                  key={resource.id}
                  onClick={() => handleResourceClick(resource)}
                  className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6 hover:bg-white/40 transition-all hover:scale-105 hover:shadow-xl cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-2 rounded-lg ${getContentTypeColor(resource.content_type)}`}
                    >
                      {getContentIcon(resource.content_type)}
                    </div>
                    <Star className="w-5 h-5 text-[#F7C548] fill-[#F7C548]" />
                  </div>

                  <h3 className="font-semibold text-[#333333] mb-2 text-lg group-hover:text-[#3A6EBB] transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-[#333333]/70 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#333333]/60">
                      <span className="bg-[#3A6EBB]/20 text-[#3A6EBB] px-2 py-1 rounded-full">
                        {resource.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{resource.view_count}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white/30 text-[#333333]/70 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Resources */}
        {regularResources.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#333333] mb-6">
              Semua Sumber Daya
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularResources.map((resource) => (
                <div
                  key={resource.id}
                  onClick={() => handleResourceClick(resource)}
                  className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6 hover:bg-white/40 transition-all hover:scale-105 hover:shadow-xl cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-2 rounded-lg ${getContentTypeColor(resource.content_type)}`}
                    >
                      {getContentIcon(resource.content_type)}
                    </div>
                    {resource.content_url && (
                      <ExternalLink className="w-4 h-4 text-[#333333]/40 group-hover:text-[#3A6EBB] transition-colors" />
                    )}
                  </div>

                  <h3 className="font-semibold text-[#333333] mb-2 text-lg group-hover:text-[#3A6EBB] transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-[#333333]/70 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#333333]/60">
                      <span className="bg-[#3A6EBB]/20 text-[#3A6EBB] px-2 py-1 rounded-full">
                        {resource.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{resource.view_count}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {resource.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white/30 text-[#333333]/70 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[#333333]/60">
                        {new Date(resource.created_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-[#333333]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#333333] mb-2">
              Tidak ada sumber daya ditemukan
            </h3>
            <p className="text-[#333333]/70">
              Coba ubah kata kunci pencarian atau filter yang digunakan
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">
            Statistik Perpustakaan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#3A6EBB] mb-1">
                {resources.length}
              </div>
              <div className="text-xs text-[#333333]/70">Total Sumber Daya</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F7C548] mb-1">
                {resources.filter((r) => r.content_type === "article").length}
              </div>
              <div className="text-xs text-[#333333]/70">Artikel</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#3A6EBB] mb-1">
                {resources.filter((r) => r.content_type === "video").length}
              </div>
              <div className="text-xs text-[#333333]/70">Video</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F7C548] mb-1">
                {Math.round(
                  resources.reduce((sum, r) => sum + r.view_count, 0) /
                    resources.length,
                )}
              </div>
              <div className="text-xs text-[#333333]/70">Rata-rata Views</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 backdrop-filter backdrop-blur-lg bg-blue-50/30 border border-blue-200/50 rounded-2xl p-6 text-center">
          <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333333] mb-2">
            Tidak Menemukan Yang Anda Cari?
          </h3>
          <p className="text-[#333333]/70 mb-4">
            Diskusikan kebutuhan Anda dengan konselor atau gunakan AI Chat untuk
            mendapatkan rekomendasi yang lebih personal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/ai-chat"
              className="bg-[#3A6EBB] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3A6EBB]/90 transition-all flex items-center justify-center space-x-2"
            >
              <Heart className="w-5 h-5" />
              <span>Chat dengan AI</span>
            </a>
            <a
              href="/schedule"
              className="border-2 border-[#3A6EBB] text-[#3A6EBB] px-6 py-3 rounded-full font-semibold hover:bg-[#3A6EBB] hover:text-white transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Jadwalkan Konsultasi</span>
            </a>
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
