"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  ArrowLeft,
  AlertTriangle,
  Loader,
  RefreshCw,
  MessageSquare,
  Users,
  Phone,
} from "lucide-react";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function AIChatPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: message, timestamp: new Date() },
    ]);
    setStreamingMessage("");
    setIsTyping(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

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

        // Add welcome message
        setMessages([
          {
            role: "assistant",
            content: `Halo ${data.user.fullName}! Saya AI Assistant BK yang siap membantu Anda dengan berbagai pertanyaan seputar konseling, kesehatan mental, dan masalah akademik. \n\nSilakan bertanya apa saja yang ingin Anda diskusikan. Ingat, saya hanya memberikan saran umum dan tidak menggantikan konsultasi langsung dengan guru BK.`,
            timestamp: new Date(),
          },
        ]);
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Anda adalah AI assistant untuk platform bimbingan konseling SMA. Anda membantu siswa dengan masalah konseling, kesehatan mental, stres akademik, dan pertanyaan umum seputar sekolah. Berikan jawaban yang empatik, suportif, dan profesional. Selalu ingatkan bahwa Anda hanya memberikan saran umum dan tidak menggantikan konsultasi langsung dengan guru BK profesional. Jika ada indikasi masalah serius atau krisis, arahkan siswa untuk segera menghubungi guru BK atau hotline darurat. Gunakan bahasa Indonesia yang ramah dan mudah dipahami.",
            },
            ...messages,
            userMessage,
          ].map((msg) => ({ role: msg.role, content: msg.content })),
          stream: true,
        }),
      });

      handleStreamResponse(response);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, terjadi kesalahan dalam mengirim pesan. Silakan coba lagi.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Halo ${user?.fullName}! Saya AI Assistant BK yang siap membantu Anda dengan berbagai pertanyaan seputar konseling, kesehatan mental, dan masalah akademik. \n\nSilakan bertanya apa saja yang ingin Anda diskusikan. Ingat, saya hanya memberikan saran umum dan tidak menggantikan konsultasi langsung dengan guru BK.`,
        timestamp: new Date(),
      },
    ]);
    setStreamingMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-screen font-inter bg-gradient-to-br from-[#E4F0F5] to-[#F6F9FC] flex items-center justify-center">
        <div className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/20 rounded-3xl p-8">
          <div className="w-8 h-8 border-4 border-[#3A6EBB]/30 border-t-[#3A6EBB] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#333333]/70 mt-4">Memuat chat AI...</p>
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
                <div className="w-10 h-10 bg-[#F7C548] rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#333333]">
                    AI Konseling Chat
                  </h1>
                  <p className="text-sm text-[#333333]/70">
                    {isTyping ? "AI sedang mengetik..." : "Siap membantu Anda"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-4 py-2 backdrop-filter backdrop-blur-lg bg-white/30 border border-white/40 rounded-xl hover:bg-white/40 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#333333]" />
              <span className="text-sm text-[#333333] hidden sm:inline">
                Reset Chat
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="backdrop-filter backdrop-blur-lg bg-white/30 border border-white/20 rounded-3xl overflow-hidden h-[calc(100vh-200px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-[#3A6EBB]"
                        : message.isError
                          ? "bg-red-500"
                          : "bg-[#F7C548]"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : message.isError ? (
                      <AlertTriangle className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`backdrop-filter backdrop-blur-lg border rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-[#3A6EBB]/20 border-[#3A6EBB]/30 text-[#333333]"
                        : message.isError
                          ? "bg-red-50/50 border-red-200/50 text-red-800"
                          : "bg-white/40 border-white/50 text-[#333333]"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="w-8 h-8 bg-[#F7C548] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 rounded-2xl p-4">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#333333]">
                      {streamingMessage}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && !streamingMessage && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#F7C548] rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="backdrop-filter backdrop-blur-lg bg-white/40 border border-white/50 rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin text-[#333333]" />
                      <span className="text-sm text-[#333333]">
                        AI sedang berpikir...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/20 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pertanyaan Anda di sini..."
                  className="w-full px-4 py-3 pr-12 backdrop-filter backdrop-blur-lg bg-white/30 border border-white/40 rounded-xl focus:ring-2 focus:ring-[#3A6EBB] focus:border-transparent outline-none transition-all placeholder-[#333333]/50 resize-none"
                  rows="1"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#3A6EBB] text-white rounded-lg hover:bg-[#3A6EBB]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-3 text-xs text-[#333333]/70 text-center">
              💡 AI ini memberikan saran umum dan tidak menggantikan konsultasi
              dengan guru BK profesional
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 backdrop-filter backdrop-blur-lg bg-red-50/30 border border-red-200/50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Phone className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-[#333333]">
              Butuh bantuan segera?
            </span>
          </div>
          <p className="text-sm text-red-600 font-semibold">
            Hotline Darurat: (021) 500-454
          </p>
        </div>
      </div>
    </div>
  );
}
