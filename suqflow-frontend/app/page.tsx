"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, BarChart3, Users, CheckCircle2, 
  TrendingDown, Calculator, BookOpen, 
  Smartphone, Laptop, WifiOff, LineChart, Zap, ShieldCheck,
  Package, Wallet, PieChart, FileText, Activity
} from "lucide-react";
import { useEffect, useState } from "react";

// --- Custom Animation Components ---

const WireframeGlobe = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-end pr-20">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="relative w-[800px] h-[800px] opacity-40 translate-x-[20%] translate-y-[10%]"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(77,112,25,1)] overflow-visible">
          {/* Base sphere wireframe */}
          <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="#4d7019" strokeWidth="0.2" strokeOpacity="0.5" />
          <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#4d7019" strokeWidth="0.2" strokeOpacity="0.5" transform="rotate(45 50 50)" />
          <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#4d7019" strokeWidth="0.2" strokeOpacity="0.5" transform="rotate(-45 50 50)" />
          <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#4d7019" strokeWidth="0.2" strokeOpacity="0.5" transform="rotate(90 50 50)" />
          <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#4d7019" strokeWidth="0.2" strokeOpacity="0.5" />

          {/* Network Paths */}
          <path d="M 20 50 L 30 30 L 55 25 L 75 35 L 85 55 L 70 75 L 45 80 L 25 65 Z" fill="none" stroke="#8eb855" strokeWidth="0.4" />
          <path d="M 30 30 L 45 45 L 75 35" fill="none" stroke="#8eb855" strokeWidth="0.4" />
          <path d="M 55 25 L 45 45 L 60 60 L 85 55" fill="none" stroke="#8eb855" strokeWidth="0.4" />
          <path d="M 25 65 L 45 45 L 45 80" fill="none" stroke="#8eb855" strokeWidth="0.4" />
          <path d="M 70 75 L 60 60" fill="none" stroke="#8eb855" strokeWidth="0.4" />
          <path d="M 20 50 L 45 45" fill="none" stroke="#8eb855" strokeWidth="0.4" />
          
          {/* External connection lines fading out */}
          <path d="M 75 35 L 95 20" fill="none" stroke="#4d7019" strokeWidth="0.3" strokeDasharray="1 1" />
          <path d="M 85 55 L 105 50" fill="none" stroke="#4d7019" strokeWidth="0.3" strokeDasharray="1 1" />
          <path d="M 70 75 L 90 90" fill="none" stroke="#4d7019" strokeWidth="0.3" strokeDasharray="1 1" />
          <path d="M 45 80 L 50 100" fill="none" stroke="#4d7019" strokeWidth="0.3" strokeDasharray="1 1" />
          <path d="M 25 65 L 5 75" fill="none" stroke="#4d7019" strokeWidth="0.3" strokeDasharray="1 1" />
          <path d="M 20 50 L 0 50" fill="none" stroke="#4d7019" strokeWidth="0.3" strokeDasharray="1 1" />

          {/* Glowing Nodes */}
          <circle cx="20" cy="50" r="1.5" fill="#b0e36f" className="animate-pulse shadow-[0_0_10px_#b0e36f]" />
          <circle cx="30" cy="30" r="1.5" fill="#b0e36f" className="animate-[pulse_3s_infinite]" />
          <circle cx="55" cy="25" r="2" fill="#fff" className="animate-pulse shadow-[0_0_15px_#fff]" />
          <circle cx="75" cy="35" r="1.5" fill="#b0e36f" className="animate-[pulse_2s_infinite]" />
          <circle cx="85" cy="55" r="2" fill="#fff" className="animate-pulse shadow-[0_0_15px_#fff]" />
          <circle cx="70" cy="75" r="1.5" fill="#b0e36f" className="animate-[pulse_4s_infinite]" />
          <circle cx="45" cy="80" r="2" fill="#fff" className="animate-pulse shadow-[0_0_15px_#fff]" />
          <circle cx="25" cy="65" r="1.5" fill="#b0e36f" className="animate-[pulse_2.5s_infinite]" />
          <circle cx="45" cy="45" r="2.5" fill="#fff" className="animate-pulse shadow-[0_0_20px_#fff]" />
          <circle cx="60" cy="60" r="1.5" fill="#b0e36f" className="animate-[pulse_3s_infinite]" />
        </svg>
      </motion.div>
    </div>
  );
};

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            delay: i * 0.15,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// --- Main Page ---

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateParallax = useTransform(scrollYProgress, [0, 1], [0, 5]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  const scrollFadeUp = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.7, ease: "backOut" } 
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  };

  const floatVariantsDelayed = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, -3, 3, 0],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        delay: 1.5,
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden font-sans selection:bg-[#4d7019]/30">
      
      {/* Background Animated Grid & Glow Effects */}
      <WireframeGlobe />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      
      {/* Ambient Rotating Glows */}
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] bg-[#4d7019]/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" 
      />
      <motion.div 
        animate={{ rotate: -360, scale: [1, 1.5, 1] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#8eb855]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" 
      />
      
      {/* Minimal Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4d7019] to-[#3a5413] flex items-center justify-center shadow-[0_0_20px_rgba(77,112,25,0.6)] group-hover:shadow-[0_0_30px_rgba(77,112,25,0.8)] transition-all group-hover:scale-110">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight group-hover:text-[#8eb855] transition-colors">SuqFlow</span>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-16 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full max-w-4xl"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(77,112,25,0.2)] cursor-default overflow-hidden relative group"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4d7019]/20 to-transparent" 
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[#8eb855] shadow-[0_0_10px_#8eb855] animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Digital Bookkeeping for Ethiopian Businesses</span>
          </motion.div>

          {/* Headline */}
          <div className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 flex flex-col items-center">
            <AnimatedText text="Enterprise Retail," />
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8, type: "spring" }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#4d7019] via-[#8eb855] to-[#4d7019] animate-[gradient_3s_ease-in-out_infinite] bg-[length:200%_auto] inline-block mt-2"
            >
              Streamlined.
            </motion.span>
          </div>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed"
          >
            A powerful, dual-platform management system designed to eliminate till leakage, track customer credit, and scale your business with crystal-clear analytics.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto relative"
          >
            {/* Ambient glow behind buttons */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-[#4d7019]/30 blur-[50px] rounded-full pointer-events-none" 
            />
            
            <a href="/signup">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#4d7019] to-[#3a5413] text-white font-bold text-lg px-10 py-5 rounded-full shadow-[0_0_30px_rgba(77,112,25,0.6)] group overflow-hidden border border-[#5f8a20]/50"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" 
                  animate={{ x: ["-150%", "250%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                />
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.div>
            </a>
            
            <a href="/login">
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center gap-2 w-full sm:w-auto bg-white/5 text-white font-medium text-lg px-10 py-5 rounded-full border border-white/10 backdrop-blur-md hover:border-[#4d7019]/50 transition-colors"
              >
                Login
              </motion.div>
            </a>
          </motion.div>
        </motion.div>

        {/* Visual Mockup - 3D Floating Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 150, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.8, type: "spring", bounce: 0.4 }}
          style={{ y: yParallax, rotateZ: rotateParallax }}
          className="mt-24 w-full max-w-5xl relative h-[450px] hidden md:block perspective-[2000px]"
        >
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[500px] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 border-t-[#4d7019]/60 border-l-[#4d7019]/20 rounded-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(77,112,25,0.2)] flex flex-col gap-6 overflow-hidden"
          >
            {/* Animated Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex gap-3">
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="h-4 w-4 rounded-full bg-red-500/50" />
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, delay: 0.2, repeat: Infinity }} className="h-4 w-4 rounded-full bg-yellow-500/50" />
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity }} className="h-4 w-4 rounded-full bg-green-500/50" />
              </div>
              <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
            </div>
            
            {/* Animated Grid Cards */}
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5 p-5 flex flex-col justify-between relative overflow-hidden group">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4d7019]/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                  />
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-1/2 bg-white/10 rounded" />
                    <Activity className="w-5 h-5 text-[#4d7019] opacity-50" />
                  </div>
                  <div className="h-10 w-3/4 bg-white/20 rounded" />
                </div>
              ))}
            </div>
            
            {/* Animated Chart Area */}
            <div className="flex-1 bg-gradient-to-t from-white/5 to-transparent rounded-xl border border-white/5 mt-2 p-6 flex items-end gap-2 relative overflow-hidden">
               {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ duration: 1.5, delay: 1.5 + (i * 0.1), type: "spring" }}
                   className="flex-1 bg-gradient-to-t from-[#4d7019]/80 to-[#8eb855] rounded-t-sm"
                 />
               ))}
            </div>
          </motion.div>

          {/* Floating UI Elements */}
          <motion.div variants={floatVariantsDelayed} animate="animate" className="absolute -left-16 top-20 z-20">
            <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className="flex items-center gap-4 bg-[#111]/90 backdrop-blur-xl border border-[#4d7019]/50 rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(77,112,25,0.3)]">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4d7019] to-[#3a5413] flex items-center justify-center border border-[#8eb855]/50">
                <BarChart3 className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Daily Revenue</p>
                <p className="text-2xl font-bold text-white">+ETB 14,500</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={floatVariants} animate="animate" className="absolute -right-12 top-48 z-20">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="flex flex-col gap-3 bg-[#111]/90 backdrop-blur-xl border border-[#4d7019]/50 rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(77,112,25,0.3)] w-72">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <CheckCircle2 className="w-6 h-6 text-[#8eb855]" />
                  </motion.div>
                  <span className="text-base font-bold text-white">Sync Complete</span>
                </div>
                <span className="text-xs text-[#4d7019] font-mono bg-[#4d7019]/10 px-2 py-1 rounded">LIVE</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#8eb855] to-transparent" 
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* The Problem Section */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }} 
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-[-10%] top-[30%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" 
        />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-20">
            <motion.h2 variants={scrollFadeUp} className="text-4xl md:text-6xl font-black text-white mb-6">Why SuqFlow?</motion.h2>
            <motion.p variants={scrollFadeUp} className="text-gray-400 max-w-2xl mx-auto text-xl">
              Ethiopian suqs actively lose a measurable percentage of daily revenue due to informal tracking. We fix that.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ y: -15, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-10 rounded-3xl border border-white/5 hover:border-red-500/50 shadow-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20 relative z-10">
                <TrendingDown className="w-8 h-8 text-red-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Stop Till Leakage</h3>
              <p className="text-gray-400 leading-relaxed relative z-10 text-lg">
                Prevent measurable percentage loss of daily revenue by moving away from highly error-prone physical notebooks.
              </p>
            </motion.div>

            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ y: -15, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-10 rounded-3xl border border-white/5 hover:border-orange-500/50 shadow-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 border border-orange-500/20 relative z-10">
                <Calculator className="w-8 h-8 text-orange-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Eliminate Manual Errors</h3>
              <p className="text-gray-400 leading-relaxed relative z-10 text-lg">
                Automated end-of-shift cash reconciliation ensures mathematical integrity of end-of-day balances instantly.
              </p>
            </motion.div>

            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ y: -15, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-10 rounded-3xl border border-white/5 hover:border-blue-500/50 shadow-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }} className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 relative z-10">
                <BookOpen className="w-8 h-8 text-blue-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Manage Customer Credit</h3>
              <p className="text-gray-400 leading-relaxed relative z-10 text-lg">
                Digitize the informal tracking of customer credit (Liq) to establish reliable cash flow forecasting and business growth.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Who Benefits Section */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent to-black/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-24">
            <motion.h2 variants={scrollFadeUp} className="text-4xl md:text-6xl font-black text-white mb-6">A Dual-Platform Ecosystem</motion.h2>
            <motion.p variants={scrollFadeUp} className="text-gray-400 max-w-2xl mx-auto text-xl">
              Optimized experiences for the two roles that keep your business moving.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Cashier side */}
            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ scale: 1.03 }}
              className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 relative overflow-hidden group hover:border-[#4d7019]/60 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-gradient-to-br from-[#4d7019]/20 to-transparent rounded-full blur-[50px] group-hover:from-[#4d7019]/30 transition-colors" 
              />
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4d7019] to-[#3a5413] flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(77,112,25,0.4)] relative z-10 border border-[#8eb855]/50"
              >
                <Smartphone className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-4xl font-black text-white mb-6 relative z-10">For Cashiers</h3>
              <p className="text-gray-400 mb-10 text-xl relative z-10 leading-relaxed">High-speed, edge-computing point-of-sale designed for execution in high-stress environments.</p>
              
              <ul className="space-y-5 relative z-10">
                <motion.li whileHover={{ x: 10 }} className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="p-2 bg-[#4d7019]/20 rounded-lg"><Zap className="w-6 h-6 text-[#8eb855]" /></div>
                  <span className="text-lg">Zero-latency checkout execution (&lt;2.0s)</span>
                </motion.li>
                <motion.li whileHover={{ x: 10 }} className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="p-2 bg-[#4d7019]/20 rounded-lg"><WifiOff className="w-6 h-6 text-[#8eb855]" /></div>
                  <span className="text-lg">Aggressive offline-first caching</span>
                </motion.li>
                <motion.li whileHover={{ x: 10 }} className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="p-2 bg-[#4d7019]/20 rounded-lg"><ShieldCheck className="w-6 h-6 text-[#8eb855]" /></div>
                  <span className="text-lg">Restricted views protecting margins</span>
                </motion.li>
              </ul>
            </motion.div>

            {/* Owner side */}
            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ scale: 1.03 }}
              className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 relative overflow-hidden group hover:border-[#4d7019]/60 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-[#4d7019]/20 to-transparent rounded-full blur-[50px] group-hover:from-[#4d7019]/30 transition-colors" 
              />
              <motion.div 
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4d7019] to-[#3a5413] flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(77,112,25,0.4)] relative z-10 border border-[#8eb855]/50"
              >
                <Laptop className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-4xl font-black text-white mb-6 relative z-10">For Owners</h3>
              <p className="text-gray-400 mb-10 text-xl relative z-10 leading-relaxed">Your administrative and financial command center accessible anywhere, anytime.</p>
              
              <ul className="space-y-5 relative z-10">
                <motion.li whileHover={{ x: 10 }} className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="p-2 bg-[#4d7019]/20 rounded-lg"><LineChart className="w-6 h-6 text-[#8eb855]" /></div>
                  <span className="text-lg">Dense data visualization for telemetry</span>
                </motion.li>
                <motion.li whileHover={{ x: 10 }} className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="p-2 bg-[#4d7019]/20 rounded-lg"><Package className="w-6 h-6 text-[#8eb855]" /></div>
                  <span className="text-lg">MDM for inventory & low-stock alerts</span>
                </motion.li>
                <motion.li whileHover={{ x: 10 }} className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="p-2 bg-[#4d7019]/20 rounded-lg"><Users className="w-6 h-6 text-[#8eb855]" /></div>
                  <span className="text-lg">Strict Role-Based Access Control</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Core Features Bento Box */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-20">
            <motion.h2 variants={scrollFadeUp} className="text-4xl md:text-6xl font-black text-white mb-6">Everything you need to scale</motion.h2>
            <motion.p variants={scrollFadeUp} className="text-gray-400 max-w-2xl mx-auto text-xl">
              A comprehensive toolkit designed specifically for the complete Ethiopian retail lifecycle.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[650px]">
            {/* Feature 1 - Large */}
            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 md:row-span-2 bg-[#111] p-12 rounded-[40px] border border-white/5 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4d7019]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="w-20 h-20 rounded-full bg-[#4d7019]/10 flex items-center justify-center mb-10 border border-[#4d7019]/30">
                <PieChart className="w-10 h-10 text-[#8eb855]" />
              </motion.div>
              <h3 className="text-4xl font-bold text-white mb-6">Business Analytics</h3>
              <p className="text-gray-400 text-xl leading-relaxed relative z-10">
                Understand what products are driving your revenue. Render visual cohorts of Revenue vs. OpEx velocity, and SKU performance by sales volume to make better restocking decisions.
              </p>
              
              {/* Decorative Chart inside card */}
              <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_30s_linear_infinite]">
                  <circle cx="50" cy="50" r="40" stroke="#8eb855" strokeWidth="20" strokeDasharray="100 150" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#4d7019" strokeWidth="20" strokeDasharray="50 200" fill="none" transform="rotate(120 50 50)" />
                </svg>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ scale: 1.05, y: -10 }}
              className="md:col-span-2 bg-[#111] p-10 rounded-[40px] border border-white/5 group hover:border-[#4d7019]/40 transition-all shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[#4d7019]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Package className="w-12 h-12 text-gray-400 mb-6 group-hover:text-[#8eb855] transition-colors relative z-10" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Inventory Management</h3>
              <p className="text-gray-400 text-lg relative z-10">Track stock, set low-stock thresholds, and instantly propagate price changes to all cashiers.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-[#111] p-10 rounded-[40px] border border-white/5 group hover:border-[#4d7019]/40 transition-all shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[#4d7019]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Wallet className="w-12 h-12 text-gray-400 mb-6 group-hover:text-[#8eb855] transition-colors relative z-10" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">End-of-Shift</h3>
              <p className="text-gray-400 text-base relative z-10">Automated calculation of Expected Cash based on Sales minus Expenses.</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              variants={scrollFadeUp}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-[#111] p-10 rounded-[40px] border border-white/5 group hover:border-[#4d7019]/40 transition-all shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[#4d7019]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <FileText className="w-12 h-12 text-gray-400 mb-6 group-hover:text-[#8eb855] transition-colors relative z-10" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Financial History</h3>
              <p className="text-gray-400 text-base relative z-10">Exportable Profit & Loss statements (PDF/CSV) as verifiable proof.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-40 px-6 text-center border-t border-white/5 bg-[#030303] overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-[#4d7019]/10 rounded-full blur-[120px] pointer-events-none" 
        />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="relative z-10"
        >
          <motion.h2 variants={scrollFadeUp} className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight flex flex-col items-center">
            Ready to digitize <span className="text-[#8eb855]">your storefront?</span>
          </motion.h2>
          <motion.div variants={scrollFadeUp}>
            <a href="/signup">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-4 bg-gradient-to-r from-[#4d7019] via-[#5f8a20] to-[#4d7019] bg-[length:200%_auto] animate-[gradient_3s_ease-in-out_infinite] text-white font-bold text-2xl px-16 py-8 rounded-full shadow-[0_0_50px_rgba(77,112,25,0.6)] group border border-[#8eb855]/50 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 blur-[10px] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <span className="relative z-10">Create your Owner Account</span>
                <ArrowRight className="w-8 h-8 relative z-10 group-hover:translate-x-3 transition-transform" />
              </motion.div>
            </a>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
