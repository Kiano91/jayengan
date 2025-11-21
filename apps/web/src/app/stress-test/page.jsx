"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Activity,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  TrendingUp,
  Heart,
  Brain,
  Target,
} from "lucide-react";

const stressQuestions = [
  {
    id: 1,
    question:
      "Seberapa sering Anda merasa khawatir atau cemas tentang tugas sekolah?",
    category: "academic",
  },
  {
    id: 2,
    question: "Seberapa sulit bagi Anda untuk berkonsentrasi saat belajar?",
    category: "academic",
  },
  {
    id: 3,
    question:
      "Seberapa sering Anda merasa kewalahan dengan jadwal kegiatan sehari-hari?",
    category: "time_management",
  },
  {
    id: 4,
    question:
      "Seberapa sering Anda mengalami kesulitan tidur karena memikirkan masalah?",
    category: "physical",
  },
  {
    id: 5,
    question: "Seberapa sering Anda merasa mudah marah atau tersinggung?",
    category: "emotional",
  },
  {
    id: 6,
    question:
      "Seberapa sering Anda merasa lelah meskipun sudah beristirahat cukup?",
    category: "physical",
  },
  {
    id: 7,
    question: "Seberapa sering Anda merasa pesimis tentang masa depan Anda?",
    category: "emotional",
  },
  {
    id: 8,
    question:
      "Seberapa sulit bagi Anda untuk menikmati aktivitas yang biasanya Anda suka?",
    category: "emotional",
  },
  {
    id: 9,
    question:
      "Seberapa sering Anda merasa tertekan oleh ekspektasi orang lain?",
    category: "social",
  },
  {
    id: 10,
    question:
      "Seberapa sering Anda merasa tidak mampu mengendalikan situasi dalam hidup Anda?",
    category: "personal_control",
  },
];

const likertScale = [
  { value: 1, label: "Tidak Pernah", color: "#4ADE80" },
  { value: 2, label: "Jarang", color: "#84CC16" },
  { value: 3, label: "Kadang-kadang", color: "#FCD34D" },
  { value: 4, label: "Sering", color: "#FB923C" },
  { value: 5, label: "Sangat Sering", color: "#EF4444" },
];

export default function StressTestPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testComplete, setTestComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);

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

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const goToNext = () => {
    if (currentQuestion < stressQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest();
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateStressLevel = () => {
    const totalScore = Object.values(answers).reduce(
      (sum, score) => sum + score,
      0,
    );
    const maxScore = stressQuestions.length * 5;
    const percentage = Math.round((totalScore / maxScore) * 100);
    return { totalScore, maxScore, percentage };
  };

  const getStressCategory = (percentage) => {
    if (percentage <= 20)
      return { level: "Sangat Rendah", color: "#4ADE80", icon: "😊" };
    if (percentage <= 40)
      return { level: "Rendah", color: "#84CC16", icon: "🙂" };
    if (percentage <= 60)
      return { level: "Sedang", color: "#FCD34D", icon: "😐" };
    if (percentage <= 80)
      return { level: "Tinggi", color: "#FB923C", icon: "😟" };
    return { level: "Sangat Tinggi", color: "#EF4444", icon: "😰" };
  };

  const getRecommendations = (percentage) => {
    if (percentage <= 40) {
      return [
        "Pertahankan pola hidup sehat yang sudah Anda jalani",
        "Lanjutkan aktivitas yang membuat Anda bahagia",
        "Tetap jaga keseimbangan antara belajar dan istirahat",
      ];
    } else if (percentage <= 60) {
      return [
        "Cobalah teknik relaksasi seperti pernapasan dalam",
        "Atur jadwal belajar yang lebih terstruktur",
        "Bicarakan perasaan Anda dengan teman atau keluarga",
        "Lakukan aktivitas fisik secara teratur",
      ];
    } else {
      return [
        "Segera konsultasi dengan guru BK atau konselor profesional",
        "Praktek mindfulness dan meditasi",
        "Kurangi beban aktivitas yang tidak perlu",
        "Pastikan tidur yang cukup dan berkualitas",
        "Jangan ragu untuk meminta bantuan dari orang terdekat",
      ];
    }
  };

  const submitTest = async () => {
    setSubmitting(true);
    try {
      const result = calculateStressLevel();
      const category = getStressCategory(result.percentage);
      const recommendations = getRecommendations(result.percentage);

      const response = await fetch("/api/stress-test/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          totalScore: result.totalScore,
          stressPercentage: result.percentage,
          userId: user.id,
        }),
      });

      if (response.ok) {
        setTestResult({
          ...result,
          category,
          recommendations,
        });
        setTestComplete(true);
      } else {
        alert("Gagal menyimpan hasil tes. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const restartTest = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setTestComplete(false);
    setTestResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC] flex items-center justify-center">
        <div className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/20 rounded-3xl p-8">
          <div className="w-8 h-8 border-4 border-[#3A6EBB]/30 border-t-[#3A6EBB] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#333333]/70 mt-4">Memuat tes stres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC]">
      {/* Header */}
      <div className="backdrop-filter backdrop-blur-lg bg-white/30 border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard/student"
                className="p-2 rounded-xl hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-[#333333]" />
              </a>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#3A6EBB] rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#333333]">
                    Tes Tingkat Stres
                  </h1>
                  <p className="text-sm text-[#333333]/70">
                    {testComplete
                      ? "Hasil Tes"
                      : `Pertanyaan ${currentQuestion + 1} dari ${stressQuestions.length}`}
                  </p>
                </div>
              </div>
            </div>

            {!testComplete && (
              <div className="text-sm text-[#333333]/70">
                Progress:{" "}
                {Math.round(
                  ((currentQuestion + 1) / stressQuestions.length) * 100,
                )}
                %
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!testComplete ? (
          /* Test Questions */
          <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-[#333333]/70 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round(
                    ((currentQuestion + 1) / stressQuestions.length) * 100,
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-white/40 rounded-full h-2">
                <div
                  className="bg-[#3A6EBB] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / stressQuestions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#333333] mb-4">
                {stressQuestions[currentQuestion].question}
              </h2>
              <p className="text-[#333333]/70">
                Pilih jawaban yang paling sesuai dengan kondisi Anda dalam 2
                minggu terakhir:
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {likertScale.map((option) => (
                <label
                  key={option.value}
                  className={`block backdrop-filter backdrop-blur-lg border rounded-2xl p-4 cursor-pointer transition-all hover:scale-102 ${
                    answers[stressQuestions[currentQuestion].id] ===
                    option.value
                      ? "bg-[#3A6EBB]/20 border-[#3A6EBB]/50"
                      : "bg-white/40 border-white/50 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option.value}
                      checked={
                        answers[stressQuestions[currentQuestion].id] ===
                        option.value
                      }
                      onChange={(e) =>
                        handleAnswer(
                          stressQuestions[currentQuestion].id,
                          parseInt(e.target.value),
                        )
                      }
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: option.color }}
                      >
                        {option.value}
                      </div>
                      <span className="font-medium text-[#333333]">
                        {option.label}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 rounded-xl text-[#333333] font-medium hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>

              <button
                onClick={goToNext}
                disabled={!answers[stressQuestions[currentQuestion].id]}
                className="px-6 py-3 bg-[#3A6EBB] text-white rounded-xl font-medium hover:bg-[#3A6EBB]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>
                    {currentQuestion === stressQuestions.length - 1
                      ? "Selesai"
                      : "Selanjutnya"}
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Test Results */
          <div className="space-y-6">
            {/* Main Result Card */}
            <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8 text-center">
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: `${testResult.category.color}20`,
                  color: testResult.category.color,
                }}
              >
                {testResult.category.icon}
              </div>

              <h2 className="text-3xl font-bold text-[#333333] mb-2">
                Tingkat Stres: {testResult.category.level}
              </h2>

              <p className="text-lg text-[#333333]/70 mb-6">
                Skor: {testResult.totalScore} dari {testResult.maxScore} (
                {testResult.percentage}%)
              </p>

              {/* Stress Level Visualization */}
              <div className="max-w-md mx-auto mb-6">
                <div className="flex justify-between text-sm text-[#333333]/70 mb-2">
                  <span>Bahagia</span>
                  <span>Stres</span>
                </div>
                <div className="relative">
                  <div className="w-full h-4 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full"></div>
                  <div
                    className="absolute top-0 w-4 h-4 bg-white border-2 rounded-full shadow-lg transform -translate-y-0"
                    style={{
                      left: `${testResult.percentage}%`,
                      borderColor: testResult.category.color,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-[#333333]/70 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-6 h-6 text-[#3A6EBB]" />
                <h3 className="text-xl font-semibold text-[#333333]">
                  Rekomendasi untuk Anda
                </h3>
              </div>

              <div className="space-y-3">
                {testResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[#333333]/80">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning for High Stress */}
            {testResult.percentage > 60 && (
              <div className="backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-800">
                    Perhatian Khusus
                  </h3>
                </div>
                <p className="text-red-700 mb-4">
                  Tingkat stres Anda cukup tinggi. Kami sangat menyarankan untuk
                  segera berkonsultasi dengan guru BK atau profesional kesehatan
                  mental.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/dashboard/student"
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors text-center"
                  >
                    Buat Jadwal Konsultasi
                  </a>
                  <div className="flex items-center justify-center space-x-2 text-red-600">
                    <span>Atau hubungi darurat: (021) 500-454</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={restartTest}
                className="flex-1 backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 text-[#333333] px-6 py-3 rounded-xl font-medium hover:bg-white/50 transition-colors"
              >
                Ulangi Tes
              </button>
              <a
                href="/dashboard/student"
                className="flex-1 bg-[#3A6EBB] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#3A6EBB]/90 transition-colors text-center"
              >
                Kembali ke Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
