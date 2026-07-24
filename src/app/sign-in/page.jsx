"use client";
import React, { useState, useEffect, Suspense } from "react";
import SignInImg from "../../../public/Assets/Login.png";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { signIn, useSession } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const SignInPageContent = () => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && session) {
      const redirect = searchParams.get("redirect");

      if (redirect) {
        router.replace(redirect);
        return;
      }

      const role = session.user?.role;

      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "artist") {
        router.replace("/dashboard/artist");
      } else {
        router.replace("/");
      }
    }
  }, [session, isPending, router, searchParams]);

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password!");
      return;
    }

    setLoading(true);
    try {
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            toast.success("Successfully signed in!");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message ||
                "Failed to sign in. Please check your credentials.",
            );
          },
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during sign in!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/sign-in`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign in failed!");
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (!mounted) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex items-center justify-center font-sans antialiased py-6 sm:py-12 md:py-16 px-4">
      {/* main */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1140px] bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row overflow-hidden items-stretch"
      >
        {/* form side*/}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-4 py-8 sm:px-8 md:px-12 lg:px-16 self-center order-2 md:order-1">
          <div className="w-full max-w-[420px] mx-auto">
            {/* Form Title Header */}
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-[24px] sm:text-[30px] lg:text-[34px] font-black tracking-tight text-[#0F172A] leading-tight mb-2 text-center md:text-left">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-[12px] sm:text-[13px] font-medium text-center md:text-left">
                Enter your credentials to access your curated gallery.
              </p>
            </motion.div>

            {/* Input Form Fields */}
            <form className="space-y-4" onSubmit={handleSignIn}>
              {/* Email Address field */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 tracking-wide uppercase">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-sm transition-all text-slate-800 shadow-sm placeholder-slate-400 font-medium"
                    required
                  />
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 tracking-wide uppercase">
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-sm transition-all text-slate-800 shadow-sm font-medium placeholder-slate-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* signin button */}
              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#7042F4] to-[#FF47A6] hover:opacity-[0.97] text-white font-bold py-3 px-4 rounded-xl transition-all text-sm shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="flex items-center my-5"
            >
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Or login with
              </span>
              <div className="flex-1 border-t border-slate-200"></div>
            </motion.div>

            {/* Google Login Button */}
            <motion.div variants={itemVariants} className="mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.91 11.91 0 0 0 12 .5c-4.81 0-8.995 2.845-10.96 6.977l4.226 2.288z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M1.04 14.523A11.854 11.854 0 0 0 1.04 9.477L5.266 11.76a7.065 7.065 0 0 1 0 2.48l-4.226 2.283z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 19.091a7.066 7.066 0 0 1-4.418-1.582L3.336 21A11.91 11.91 0 0 0 12 23.5c3.264 0 6.255-1.091 8.614-2.955l-4.14-3.527a7.042 7.042 0 0 1-4.474 2.073z"
                  />
                  <path
                    fill="#34A853"
                    d="M23.491 12.273c0-.818-.073-1.609-.209-2.373H12v4.51h6.464a5.525 5.525 0 0 1-2.4 3.618l4.14 3.527c2.418-2.227 3.887-5.505 3.887-9.282z"
                  />
                </svg>
                Continue with Google
              </button>
            </motion.div>

            {/* SignUp Page Link */}
            <motion.div
              variants={itemVariants}
              className="mt-6 text-center text-xs font-semibold text-slate-500"
            >
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-[#7042F4] font-bold hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>

        {/* image side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex w-1/2 relative p-3 items-stretch self-stretch order-1 md:order-2"
        >
          <div className="relative w-full min-h-full rounded-[24px] overflow-hidden shadow-inner flex">
            <Image
              src={SignInImg}
              alt="ArtHub Security Hub"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
              className="transition-transform duration-700 hover:scale-105"
            />

            {/* Top tooltip */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(112,66,244,0.2), 0 4px 20px rgba(0,0,0,0.3)",
                  "0 0 22px 6px rgba(255,71,166,0.5), 0 4px 20px rgba(0,0,0,0.3)",
                  "0 0 10px 2px rgba(112,66,244,0.2), 0 4px 20px rgba(0,0,0,0.3)",
                ],
                borderColor: [
                  "rgba(255,255,255,0.15)",
                  "rgba(255,71,166,0.6)",
                  "rgba(112,66,244,0.6)",
                  "rgba(255,255,255,0.15)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-4 right-4 lg:top-8 lg:right-8 bg-black/40 backdrop-blur-md px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-[10px] lg:text-[11px] font-bold uppercase tracking-widest text-white border z-10 select-none"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mr-1 text-purple-400"
              >
                ✦
              </motion.span>
              Secure Platform
            </motion.div>

            {/* Bottom Tooltip */}
            <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8 bg-white/20 backdrop-blur-xl p-4 lg:p-5 rounded-2xl border border-white/20 flex items-center justify-between text-white shadow-2xl z-10">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-[#7042F4] to-[#FF47A6] flex items-center justify-center shadow-md text-white flex-shrink-0">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-bold tracking-tight">
                    Welcome Back to ArtHub
                  </p>
                  <p className="text-[11px] lg:text-xs text-white/80">
                    Your digital assets are waiting for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center bg-[#F1F5F9]"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <SignInPageContent />
    </Suspense>
  );
};

export default SignInPage;
