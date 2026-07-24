"use client";
import React, { useState, useRef, useEffect } from 'react';
import signupimg from '../../../public/Assets/Signup.png';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, User, Image as ImageIcon, ShoppingBag, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUp, signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const SignUpPage = () => {
  // States
  const [role, setRole] = useState('collector');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef(null);
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already signed in
  useEffect(() => {
    if (!isPending && session) {
      const role = session.user?.role;
      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "artist") {
        router.replace("/dashboard/artist");
      } else {
        router.replace("/");
      }
    }
  }, [session, isPending, router]);

  // Password Strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { text: '', color: '', bgColor: '' };
    if (pass.length < 8) return { text: 'Weak (Min 8 chars)', color: 'text-red-500', bgColor: 'bg-red-500/10' };
    
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
    if (strongRegex.test(pass)) {
      return { text: 'Strong Password', color: 'text-emerald-600', bgColor: 'bg-emerald-500/10' };
    }
    return { text: 'Medium / Easy', color: 'text-amber-500', bgColor: 'bg-amber-500/10' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Handle Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
      setImageFile(file);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name!");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address!");
      return;
    }
    if (!password) {
      toast.error("Please create a password!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    setLoading(true);
    let imageUrl = '';

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        if (data.success) {
          imageUrl = data.data.url;
        } else {
          toast.error("Profile picture upload failed. Continuing with default avatar.");
        }
      }

      const resolvedRole = role === 'collector' ? 'user' : 'artist';
      
      const { data, error } = await signUp.email({
        email,
        password,
        name,
        image: imageUrl || undefined,
        role: resolvedRole
      });

      if (error) {
        toast.error(error.message || "Failed to create account!");
      } else {
        toast.success("Account created successfully!", {
          position: "top-right"
        });
        router.push('/sign-in');
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during sign up!");
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
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
      
      {/* main container*/}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1140px] bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row overflow-hidden items-stretch"
      >
        
        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex w-1/2 relative p-3 items-stretch self-stretch"
        >
          <div className="relative w-full min-h-full rounded-[24px] overflow-hidden shadow-inner flex">
            <Image 
              src={signupimg} 
              alt="Curated Digital Asset" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
              className="transition-transform duration-700 hover:scale-105"
            />
            
            {/* top tooltip*/}
            <motion.div 
              animate={{ 
                boxShadow: [
                  "0 0 10px 2px rgba(112,66,244,0.2), 0 4px 20px rgba(0,0,0,0.3)",
                  "0 0 22px 6px rgba(255,71,166,0.5), 0 4px 20px rgba(0,0,0,0.3)",
                  "0 0 10px 2px rgba(112,66,244,0.2), 0 4px 20px rgba(0,0,0,0.3)"
                ],
                borderColor: [
                  "rgba(255,255,255,0.15)",
                  "rgba(255,71,166,0.6)",
                  "rgba(112,66,244,0.6)",
                  "rgba(255,255,255,0.15)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest text-white border z-10 select-none"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="mr-1 text-purple-400"
              >
                ✦
              </motion.span>
              Curated Digital Asset
            </motion.div>

            {/* bottom tooltip */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-xl p-5 rounded-2xl border border-white/20 flex items-center justify-between text-white shadow-2xl z-10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  <span className="w-9 h-9 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-xs shadow-sm">👤</span>
                  <span className="w-9 h-9 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-xs shadow-sm">⚡</span>
                  <span className="w-9 h-9 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-xs shadow-sm">💎</span>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">Join 50k+ Collectors</p>
                  <p className="text-xs text-white/80">Access exclusive digital premieres</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* main form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-4 py-8 sm:px-8 md:px-12 lg:px-16 self-center">
          <div className="w-full max-w-[420px] mx-auto">
            
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-5">
              <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] font-black tracking-tight text-[#0F172A] leading-tight mb-2">Begin Your Collection</h2>
              <p className="text-slate-500 text-[13px] font-medium">Join the global community of top artists and collectors.</p>
            </motion.div>

            {/* Role selector */}
            <motion.div variants={itemVariants} className="p-1 bg-slate-100 rounded-2xl flex gap-1 mb-5 border border-slate-200/40 relative">
              <button
                type="button"
                onClick={() => setRole('collector')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative z-10 ${
                  role === 'collector' ? 'text-purple-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShoppingBag size={14} /> I am a Collector
              </button>
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative z-10 ${
                  role === 'artist' ? 'text-purple-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Palette size={14} /> I am an Artist
              </button>
              
              {/* Animated Background Indicator */}
              <motion.div
                className="absolute top-1 bottom-1 left-1 bg-white rounded-xl shadow-sm border border-slate-200/20"
                initial={false}
                animate={{
                  left: role === 'collector' ? '4px' : 'calc(50% + 2px)',
                  width: 'calc(50% - 6px)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>

            {/* Form */}
            <form className="space-y-3.5" onSubmit={handleSignUp}>
              
              {/* Name */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 tracking-wide uppercase">Full Name</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-sm transition-all text-slate-800 shadow-sm placeholder-slate-400 font-medium"
                    required
                  />
                </div>
              </motion.div>

              {/* Email Address */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 tracking-wide uppercase">Email Address</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 group-focus-within:text-purple-500 transition-colors">
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

              {/* Image Upload */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 tracking-wide uppercase">Profile Image</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    {imagePreview ? (
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-purple-500 shadow-sm relative">
                        <Image src={imagePreview} alt="Icon Preview" fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <ImageIcon size={16} className="group-focus-within:text-purple-500 transition-colors" />
                    )}
                  </span>
                  
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="w-full pl-10 pr-24 py-3 bg-white border border-slate-200 rounded-xl text-sm transition-all cursor-pointer flex items-center justify-between text-slate-400 select-none hover:border-slate-300 focus-within:ring-4 focus-within:ring-purple-500/10 shadow-sm font-medium"
                  >
                    <span className={imagePreview ? "text-slate-800 truncate max-w-[140px] sm:max-w-[180px]" : "text-sm text-slate-400"}>
                      {imagePreview ? imageName : "Upload your profile picture"}
                    </span>
                    
                    <span className="absolute right-2 top-2 bottom-2 bg-slate-50 text-slate-700 border border-slate-200/60 font-bold text-xs px-3 flex items-center rounded-lg hover:bg-slate-100 transition-colors">
                      Browse
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".png, .jpg, .jpeg, .webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </motion.div>

              {/* Create Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 tracking-wide uppercase">Create Password</label>
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
                <AnimatePresence>
                  {password && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-md text-xs font-bold ${passwordStrength.color} ${passwordStrength.bgColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {passwordStrength.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5 tracking-wide uppercase">Confirm Password</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-sm transition-all text-slate-800 shadow-sm font-medium placeholder-slate-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <AnimatePresence>
                  {confirmPassword && password !== confirmPassword && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-md text-xs font-bold text-red-500 bg-red-500/10"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      Passwords do not match
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* terms chckbox not functional */}
              <motion.div variants={itemVariants} className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500/30 accent-purple-600 cursor-pointer transition-all"
                  required
                />
                <label htmlFor="terms" className="text-xs font-semibold text-slate-500 cursor-pointer select-none">
                  I agree to the <span className="text-purple-600 font-bold hover:underline transition-all">Terms</span> and <span className="text-purple-600 font-bold hover:underline transition-all">Privacy Policy</span>
                </label>
              </motion.div>

              {/* create account btn */}
              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 bg-gradient-to-r from-[#7042F4] to-[#FF47A6] hover:opacity-[0.97] text-white font-bold py-3 px-4 rounded-xl transition-all text-sm shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </motion.button>
              </motion.div>
            </form>

            {/* sign in option */}
            <motion.div variants={itemVariants} className="mt-6 text-center text-xs font-semibold text-slate-500">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-[#7042F4] font-bold hover:underline transition-colors">
                Sign In
              </Link>
            </motion.div>

          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default SignUpPage;