"use client";

import { motion } from "framer-motion";

interface AIMascotProps {
  mood: "calm" | "thinking" | "happy" | "empathetic";
  size?: number;
}

export default function AIMascot({ mood, size = 150 }: AIMascotProps) {
  // Define eye variants based on mood
  const getEyePath = (side: "left" | "right") => {
    switch (mood) {
      case "happy":
        // Happy arch eyes: ^ ^
        return side === "left" 
          ? "M 32 48 Q 40 38 48 48" 
          : "M 72 48 Q 80 38 88 48";
      case "empathetic":
        // Gentle downward arches or warm ovals
        return side === "left"
          ? "M 32 46 Q 40 50 48 46"
          : "M 72 46 Q 80 50 88 46";
      case "thinking":
        // Small dots for thinking/processing
        return side === "left"
          ? "M 38 48 A 2 2 0 1 1 37.99 48"
          : "M 78 48 A 2 2 0 1 1 77.99 48";
      case "calm":
      default:
        // Friendly ovals
        return side === "left"
          ? "M 35 44 A 5 7 0 1 1 34.99 44"
          : "M 75 44 A 5 7 0 1 1 74.99 44";
    }
  };

  const getGlowColor = () => {
    switch (mood) {
      case "happy":
        return "rgba(34, 197, 94, 0.4)"; // Green glow
      case "empathetic":
        return "rgba(244, 63, 94, 0.4)"; // Rose pink glow
      case "thinking":
        return "rgba(234, 179, 8, 0.4)"; // Yellow glow
      case "calm":
      default:
        return "rgba(8, 157, 140, 0.4)"; // Seafoam cyan glow
    }
  };

  const getEyeColor = () => {
    switch (mood) {
      case "happy":
        return "#22c55e"; // Green
      case "empathetic":
        return "#f43f5e"; // Rose Pink
      case "thinking":
        return "#eab308"; // Yellow
      case "calm":
      default:
        return "#089D8C"; // Seafoam cyan
    }
  };

  // Body floating variants
  const floatVariants: any = {
    calm: {
      y: [0, -8, 0],
      rotate: [0, 1, 0, -1, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    thinking: {
      y: [0, -3, 0],
      rotate: [0, -1, 1, -1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    happy: {
      y: [0, -15, 0],
      scale: [1, 1.05, 0.98, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    empathetic: {
      y: [0, -5, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow effect behind mascot */}
      <motion.div
        className="absolute rounded-full filter blur-xl opacity-60"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          backgroundColor: getGlowColor(),
        }}
        animate={{
          scale: mood === "thinking" ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: mood === "thinking" ? [0.4, 0.7, 0.4] : [0.5, 0.6, 0.5],
        }}
        transition={{
          duration: mood === "thinking" ? 1 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-lg z-10"
        animate={mood}
        variants={floatVariants}
      >
        {/* Shadow under floating body */}
        <ellipse cx="60" cy="112" rx="35" ry="5" fill="rgba(8, 157, 140, 0.15)" />

        {/* Mascot Ears/Side Antennas */}
        <motion.rect
          x="12"
          y="48"
          width="8"
          height="16"
          rx="4"
          fill="var(--primary)"
          animate={mood === "thinking" ? { fill: ["#00685c", "#eab308", "#00685c"] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.rect
          x="100"
          y="48"
          width="8"
          height="16"
          rx="4"
          fill="var(--primary)"
          animate={mood === "thinking" ? { fill: ["#00685c", "#eab308", "#00685c"] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Head/Body Capsule - Metallic Glassmorphic Look */}
        <rect
          x="20"
          y="20"
          width="80"
          height="76"
          rx="38"
          fill="var(--surface-container-lowest)"
          stroke="rgba(8, 157, 140, 0.25)"
          strokeWidth="2"
        />

        {/* Face Screen */}
        <rect
          x="26"
          y="28"
          width="68"
          height="52"
          rx="26"
          fill="#171d1b"
          stroke="rgba(86, 127, 119, 0.15)"
          strokeWidth="1.5"
        />

        {/* Eyes (Animated Path) */}
        <motion.path
          d={getEyePath("left")}
          fill={mood === "calm" ? getEyeColor() : "none"}
          stroke={getEyeColor()}
          strokeWidth={mood === "calm" ? "0" : "4"}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ stroke: getEyeColor(), fill: mood === "calm" ? getEyeColor() : "none" }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d={getEyePath("right")}
          fill={mood === "calm" ? getEyeColor() : "none"}
          stroke={getEyeColor()}
          strokeWidth={mood === "calm" ? "0" : "4"}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ stroke: getEyeColor(), fill: mood === "calm" ? getEyeColor() : "none" }}
          transition={{ duration: 0.3 }}
        />

        {/* Blush cheeks */}
        {(mood === "happy" || mood === "empathetic") && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            <circle cx="34" cy="62" r="5" fill="#f43f5e" filter="blur(1px)" />
            <circle cx="86" cy="62" r="5" fill="#f43f5e" filter="blur(1px)" />
          </motion.g>
        )}

        {/* Pulse Ring (on head, top antenna) */}
        <circle cx="60" cy="14" r="4" fill="var(--primary)" />
        <motion.circle
          cx="60"
          y="14"
          r="8"
          fill="none"
          stroke="var(--primary-bright)"
          strokeWidth="1"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={mood === "thinking" ? { scale: [0.5, 2.5, 0.5], opacity: [1, 0, 1] } : { scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          style={{ originX: "60px", originY: "14px" }}
        />
      </motion.svg>
    </div>
  );
}
