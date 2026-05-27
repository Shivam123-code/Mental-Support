"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Brain, MessageCircle, TrendingUp, Shield, Sparkles, 
  ArrowRight, Heart, Lock, AlertTriangle, Send, X, Phone 
} from "lucide-react";
import AIMascot from "@/components/ui/AIMascot";

const aiModules = [
  { icon: MessageCircle, title: "AI Companion", desc: "Daily emotional support through intelligent, empathetic conversations. Always available, never judgmental.", tag: "Daily Support" },
  { icon: Brain, title: "AI Journaling", desc: "Mood & emotional pattern analysis. Understand your feelings through guided reflective writing.", tag: "Self-Awareness" },
  { icon: Sparkles, title: "AI Recommendations", desc: "Personalized suggestions for programs, professionals, and wellness resources based on your journey.", tag: "Guidance" },
  { icon: TrendingUp, title: "AI Burnout Prediction", desc: "Workplace & personal wellbeing insights. Get early warnings before burnout hits.", tag: "Prevention" },
  { icon: AlertTriangle, title: "AI Risk Detection", desc: "Safety escalation assistance. Automatically connects you with human support when needed.", tag: "Safety" },
  { icon: Heart, title: "Emotional Trend Tracking", desc: "Visualize your emotional patterns over time. See growth, identify triggers, celebrate progress.", tag: "Insights" },
];

const governance = [
  { title: "Human Supervision", desc: "All AI interactions are monitored by qualified professionals" },
  { title: "Non-Diagnostic", desc: "AI provides guidance, never clinical diagnoses" },
  { title: "Ethical Policy", desc: "Strict ethical framework governs all AI behavior" },
  { title: "Safety Escalation", desc: "Automatic human handoff for crisis situations" },
  { title: "Transparency", desc: "You always know when you're interacting with AI" },
  { title: "Data Privacy", desc: "Your conversations are encrypted and never sold" },
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

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen, isLoading]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (expressionTimeoutRef.current) {
        clearTimeout(expressionTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setBotMood("thinking");

    if (expressionTimeoutRef.current) {
      clearTimeout(expressionTimeoutRef.current);
    }

    try {
      // Format messages for the API (system prompt is added on the backend)
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      
      const botMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.text || "I'm here for you, but I encountered a small glitch. Can you say that again?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setBotMood(data.mood || "calm");
      setIsLoading(false);

      // Revert back to calm expression after 6 seconds
      expressionTimeoutRef.current = setTimeout(() => {
        setBotMood("calm");
      }, 6000);

    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please make sure you are online or try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setBotMood("calm");
      setIsLoading(false);
    }
  };

  const getStatusText = () => {
    switch (botMood) {
      case "thinking":
        return "Klever is reflecting...";
      case "happy":
        return "Klever is smiling warmly";
      case "empathetic":
        return "Klever is listening with care";
      case "calm":
      default:
        return "Klever is online";
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--surface)]">
      {/* Hero */}
      <section className="relative bg-[var(--primary)] text-white overflow-hidden py-16 sm:py-24 md:py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
            <Brain size={14} /> AI Ecosystem
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-6">
            Your Intelligent<br />Wellbeing Companion
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-10">
            AI that understands, supports, and guides — without ever replacing human connection. Available 24/7, ethically governed, and always transparent.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-6 sm:px-8 py-3.5 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <MessageCircle size={18} /> Chat with Klever
            </button>
            <Link href="/journal" className="px-6 sm:px-8 py-3.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base">
              Try AI Journaling
            </Link>
          </div>
        </div>
      </section>

      {/* AI Modules */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">AI-Powered Modules</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Six intelligent modules working together to support your emotional wellbeing journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {aiModules.map((module) => (
              <div key={module.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                    <module.icon className="text-[var(--primary)]" size={20} />
                  </div>
                  <span className="text-[10px] sm:text-xs bg-[var(--primary-fixed)] text-[var(--primary)] px-2 py-0.5 rounded-full font-medium">{module.tag}</span>
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{module.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Governance */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="chip mx-auto w-fit mb-4"><Shield size={14} /> Ethical AI</div>
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">AI Governance & Safety</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Our AI is built with strict ethical boundaries. It assists — it never replaces human judgment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {governance.map((item) => (
              <div key={item.title} className="card">
                <h3 className="font-semibold text-[var(--on-surface)] mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Companion Mascot Section (Replaces waitlist) */}
      <section className="section-gap bg-[var(--surface-container)] text-center relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--primary-fixed)] filter blur-3xl opacity-20 -translate-y-1/2 pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[var(--tertiary-fixed)] filter blur-3xl opacity-20 -translate-y-1/2 pointer-events-none rounded-full" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
          <div className="mb-4">
            <AIMascot mood="calm" size={140} />
          </div>
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Chat Privately with Klever</h2>
          <p className="text-body-md text-[var(--on-surface-variant)] max-w-xl mx-auto mb-8">
            Need a moment of calm, a comforting word, or just someone to listen? Klever uses advanced, ethically-guided AI to support your mental wellbeing 24/7. Completely private and secure.
          </p>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="btn-primary inline-flex items-center gap-2 cursor-pointer shadow-ambient-hover hover:scale-[1.03] active:scale-[0.98]"
          >
            Start Conversation <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Chat Panel Backdrop */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[99] transition-opacity duration-300"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {/* Slide-in Chat Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[var(--surface-container-lowest)] border-l border-[var(--outline-variant)] shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-out transform ${
          isChatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Chat Panel Header */}
        <div className="p-4 border-b border-[var(--outline-variant)] bg-[var(--surface)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AIMascot mood={botMood} size={48} />
            <div>
              <h3 className="font-semibold text-[var(--on-surface)] text-base flex items-center gap-1.5">
                Klever
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-xs text-[var(--on-surface-variant)] transition-all duration-200">
                {getStatusText()}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[var(--surface-container-lowest)] scrollbar-thin">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col max-w-[85%] ${
                m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div 
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user" 
                    ? "bg-[var(--primary)] text-white rounded-tr-none shadow-sm"
                    : "bg-[var(--surface-container-low)] text-[var(--on-surface)] rounded-tl-none border-hairline"
                }`}
              >
                {m.content}
              </div>
              <span className="text-[10px] text-[var(--on-surface-variant)]/60 mt-1 px-1">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {/* Typing Indicator */}
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

        {/* Quick Prompts (only shown when conversation is at the start) */}
        {messages.length === 1 && !isLoading && (
          <div className="px-6 py-3 bg-[var(--surface-container-low)] border-t border-[var(--outline-variant)]">
            <p className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider mb-2">Suggestions</p>
            <div className="flex flex-col gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSendMessage(p)}
                  className="w-full text-left px-3 py-2 bg-[var(--surface-container-lowest)] hover:bg-[var(--primary-fixed)] hover:text-[var(--primary)] text-xs font-medium text-[var(--on-surface-variant)] border border-[var(--outline-variant)] rounded-lg transition-all cursor-pointer truncate"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Footer */}
        <div className="p-4 bg-[var(--surface)] border-t border-[var(--outline-variant)]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              placeholder="Share what is on your mind..."
              className="flex-1 px-4 py-3 bg-[var(--surface-container-lowest)] text-sm text-[var(--on-surface)] border border-[var(--outline-variant)] rounded-xl placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] disabled:opacity-60 transition-all"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-11 h-11 bg-[var(--primary)] hover:bg-[var(--primary-container)] disabled:opacity-40 disabled:hover:bg-[var(--primary)] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
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
