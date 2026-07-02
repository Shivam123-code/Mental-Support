"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, MessageCircle, TrendingUp, Shield, Sparkles,
  ArrowRight, Heart, Lock, AlertTriangle, Send, X,
  CheckCircle, Users, Zap,
} from "lucide-react";
import AIMascot from "@/components/ui/AIMascot";

const aiModules = [
  { icon: MessageCircle, title: "AI Companion",          desc: "Daily emotional support through intelligent, empathetic conversations. Always available, never judgmental.", tag: "Daily Support",  color: "from-teal-400/15 to-emerald-400/10",  iconBg: "bg-teal-100",   iconColor: "text-teal-600",   size: "lg" },
  { icon: Brain,          title: "AI Journaling",         desc: "Mood & emotional pattern analysis. Understand your feelings through guided reflective writing.",            tag: "Self-Awareness", color: "from-violet-400/15 to-purple-400/10",  iconBg: "bg-violet-100", iconColor: "text-violet-600", size: "sm" },
  { icon: Sparkles,       title: "AI Recommendations",    desc: "Personalized suggestions for programs, professionals, and wellness resources based on your journey.",        tag: "Guidance",       color: "from-amber-400/15 to-orange-400/10",  iconBg: "bg-amber-100",  iconColor: "text-amber-600",  size: "sm" },
  { icon: TrendingUp,     title: "AI Burnout Prediction", desc: "Workplace & personal wellbeing insights. Get early warnings before burnout hits.",                          tag: "Prevention",     color: "from-rose-400/15 to-pink-400/10",     iconBg: "bg-rose-100",   iconColor: "text-rose-500",   size: "sm" },
  { icon: AlertTriangle,  title: "AI Risk Detection",     desc: "Safety escalation assistance. Automatically connects you with human support when needed.",                  tag: "Safety",         color: "from-red-400/15 to-rose-400/10",      iconBg: "bg-red-100",    iconColor: "text-red-500",    size: "sm" },
  { icon: Heart,          title: "Emotional Trend Tracking", desc: "Visualize your emotional patterns over time. See growth, identify triggers, celebrate progress.",        tag: "Insights",       color: "from-sky-400/15 to-blue-400/10",      iconBg: "bg-sky-100",    iconColor: "text-sky-500",    size: "lg" },
];

const governance = [
  { icon: Users,        title: "Human Supervision",  desc: "All AI interactions are monitored by qualified professionals" },
  { icon: Shield,       title: "Non-Diagnostic",      desc: "AI provides guidance, never clinical diagnoses" },
  { icon: CheckCircle,  title: "Ethical Policy",      desc: "Strict ethical framework governs all AI behavior" },
  { icon: Zap,          title: "Safety Escalation",   desc: "Automatic human handoff for crisis situations" },
  { icon: Brain,        title: "Transparency",         desc: "You always know when you're interacting with AI" },
  { icon: Lock,         title: "Data Privacy",         desc: "Your conversations are encrypted and never sold" },
];

const quickPrompts = [
  "I'm feeling very stressed today",
  "Can you help me calm my mind?",
  "I had a conflict at work",
  "Let's do a quick breathing pause",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AICompanion() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Klever, your AI wellbeing companion. I'm here to listen, offer emotional support, and chat about whatever's on your mind. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [botMood, setBotMood] = useState<"calm" | "thinking" | "happy" | "empathetic">("calm");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const expressionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [messages, isChatOpen, isLoading]);

  useEffect(() => {
    return () => {
      if (expressionTimeoutRef.current) clearTimeout(expressionTimeoutRef.current);
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMessage: Message = { id: Math.random().toString(36).substring(7), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setBotMood("thinking");
    if (expressionTimeoutRef.current) clearTimeout(expressionTimeoutRef.current);
    try {
      const chatHistory = [...messages, userMessage].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: chatHistory }) });
      if (!res.ok) throw new Error("Failed to fetch response");
      const data = await res.json();
      const botMessage: Message = { id: Math.random().toString(36).substring(7), role: "assistant", content: data.text || "I'm here for you, but I encountered a small glitch. Can you say that again?", timestamp: new Date() };
      setMessages((prev) => [...prev, botMessage]);
      setBotMood(data.mood || "calm");
      setIsLoading(false);
      expressionTimeoutRef.current = setTimeout(() => { setBotMood("calm"); }, 6000);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = { id: Math.random().toString(36).substring(7), role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please make sure you are online or try again in a moment.", timestamp: new Date() };
      setMessages((prev) => [...prev, errorMessage]);
      setBotMood("calm");
      setIsLoading(false);
    }
  };

  const getStatusText = () => {
    switch (botMood) {
      case "thinking":   return "Klever is reflecting...";
      case "happy":      return "Klever is smiling warmly";
      case "empathetic": return "Klever is listening with care";
      default:           return "Klever is online";
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--surface)]">

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: "linear-gradient(135deg, #0a2e2b 0%, #0d3d38 55%, #0f3d35 100%)" }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/20 blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-violet-500/15 blur-[100px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-bold uppercase tracking-widest mb-6"
              >
                <Brain size={12} /> AI Ecosystem
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.06 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-medium leading-tight text-white mb-6"
              >
                Your Intelligent<br />
                <span style={{ background: "linear-gradient(90deg, #93d2cc, #b8e8e4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Wellbeing Companion
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="text-white/60 text-base sm:text-lg mb-8 max-w-lg leading-relaxed"
              >
                AI that understands, supports, and guides — without ever replacing human connection. Available 24/7, ethically governed, and always transparent.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="grid grid-cols-3 gap-3 mb-8"
              >
                {[
                  { val: "24/7",   label: "Available" },
                  { val: "100%",   label: "Confidential" },
                  { val: "6",      label: "AI Modules" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <p className="font-bold text-white text-xl leading-none">{s.val}</p>
                    <p className="text-white/50 text-[11px] mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setIsChatOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[var(--primary)] font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-sm cursor-pointer"
                >
                  <MessageCircle size={16} /> Chat with Klever
                </motion.button>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/journal" className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white font-semibold rounded-full hover:bg-white/10 transition-all text-sm">
                    Try AI Journaling <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — mascot + chat preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" as const }}
              className="hidden lg:flex flex-col items-center gap-6 relative"
            >
              {/* Glow behind mascot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[var(--primary)]/25 blur-[60px] pointer-events-none" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
                className="relative z-10"
              >
                <AIMascot mood={botMood} size={180} />
              </motion.div>

              {/* Floating chat bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative z-10 w-full max-w-sm rounded-2xl p-5 shadow-xl"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/70 text-xs font-semibold">Klever is online</span>
                </div>
                <p className="text-white/85 text-sm leading-relaxed">
                  &ldquo;Hello! I&apos;m here to listen and support you. How are you feeling today? 💚&rdquo;
                </p>
                <div className="flex gap-2 mt-4">
                  {["Feeling anxious", "Need to vent", "Just talk"].map((t) => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(147,210,204,0.2)", color: "#93d2cc", border: "1px solid rgba(147,210,204,0.3)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AI MODULES ── */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ AI Capabilities</p>
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">AI-Powered Modules</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Six intelligent modules working together to support your emotional wellbeing journey.
            </p>
          </motion.div>

          {/* Bento grid: first 2 large, next 4 small in 2 rows of 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiModules.map((module, i) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`group rounded-2xl border border-[var(--outline-variant)]/30 bg-white shadow-sm hover:shadow-xl transition-all overflow-hidden ${module.size === "lg" ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  {/* Top colour band */}
                  <div className={`h-2 w-full bg-gradient-to-r ${module.color.replace("/15", "/60").replace("/10", "/40")}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl ${module.iconBg} flex items-center justify-center shadow-sm`}>
                        <Icon size={22} className={module.iconColor} />
                      </div>
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${module.iconBg} ${module.iconColor}`}>
                        {module.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--on-surface)] text-base mb-2 group-hover:text-[var(--primary)] transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{module.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CHAT MASCOT CTA ── */}
      <section className="section-gap bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--primary-fixed)] blur-3xl opacity-20 -translate-y-1/2 pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[var(--tertiary-fixed)] blur-3xl opacity-20 -translate-y-1/2 pointer-events-none rounded-full" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-4">\\ Start Now</p>
              <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Chat Privately with Klever</h2>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-8 leading-relaxed">
                Need a moment of calm, a comforting word, or just someone to listen? Klever uses advanced, ethically-guided AI to support your mental wellbeing 24/7. Completely private and secure.
              </p>

              {/* Quick prompts as pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setIsChatOpen(true); }}
                    className="text-xs px-4 py-2 rounded-full border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--primary-fixed)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setIsChatOpen(true)}
                className="btn-primary inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                Start Conversation <ArrowRight size={16} />
              </motion.button>
            </motion.div>

            {/* Right — mascot */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
              >
                <AIMascot mood="calm" size={200} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AI GOVERNANCE — dark ── */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(135deg, #0a2e2b 0%, #0d3d38 60%, #0a2e2b 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-3">\\ Ethical AI</p>
            <h2 className="text-headline-lg text-white mb-4">AI Governance & Safety</h2>
            <p className="text-white/60 text-body-lg max-w-2xl mx-auto">
              Our AI is built with strict ethical boundaries. It assists — it never replaces human judgment.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {governance.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="flex gap-4 p-5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(147,210,204,0.18)", border: "1px solid rgba(147,210,204,0.25)" }}>
                    <Icon size={18} style={{ color: "var(--primary-fixed)" }} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                    <p className="text-white/55 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CHAT PANEL BACKDROP ── */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[99]"
            onClick={() => setIsChatOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SLIDE-IN CHAT PANEL ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[var(--surface-container-lowest)] border-l border-[var(--outline-variant)] shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-out transform ${
          isChatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--outline-variant)] bg-[var(--surface)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AIMascot mood={botMood} size={48} />
            <div>
              <h3 className="font-semibold text-[var(--on-surface)] text-base flex items-center gap-1.5">
                Klever
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-xs text-[var(--on-surface-variant)] transition-all duration-200">{getStatusText()}</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[var(--surface-container-lowest)] scrollbar-thin">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col max-w-[85%] ${m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-[var(--primary)] text-white rounded-tr-none shadow-sm" : "bg-[var(--surface-container-low)] text-[var(--on-surface)] rounded-tl-none border-hairline"}`}>
                {m.content}
              </div>
              <span className="text-[10px] text-[var(--on-surface-variant)]/60 mt-1 px-1">
                {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start max-w-[85%] mr-auto">
              <div className="px-4 py-3.5 bg-[var(--surface-container-low)] rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        {messages.length === 1 && !isLoading && (
          <div className="px-6 py-3 bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)]">
            <p className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider mb-2">Suggestions</p>
            <div className="flex flex-col gap-2">
              {quickPrompts.map((p) => (
                <button key={p} onClick={() => handleSendMessage(p)}
                  className="w-full text-left px-3 py-2 bg-[var(--surface-container-lowest)] hover:bg-[var(--primary-fixed)] hover:text-[var(--primary)] text-xs font-medium text-[var(--on-surface-variant)] border border-[var(--outline-variant)] rounded-lg transition-all cursor-pointer truncate">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-[var(--surface)] border-t border-[var(--outline-variant)]">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              placeholder="Share what is on your mind..."
              className="flex-1 px-4 py-3 bg-[var(--surface-container-lowest)] text-sm text-[var(--on-surface)] border border-[var(--outline-variant)] rounded-xl placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] disabled:opacity-60 transition-all"
            />
            <button type="submit" disabled={!inputText.trim() || isLoading}
              className="w-11 h-11 bg-[var(--primary)] hover:bg-[var(--primary-container)] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer">
              <Send size={16} />
            </button>
          </form>
          <div className="flex items-center gap-1.5 justify-center mt-2.5 text-[10px] text-[var(--on-surface-variant)]/70">
            <Lock size={10} /> Fully confidential and end-to-end encrypted.
          </div>
        </div>
      </div>
    </div>
  );
}
