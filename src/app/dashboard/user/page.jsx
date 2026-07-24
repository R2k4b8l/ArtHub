"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Palette, ListTodo, ShieldCheck } from "lucide-react";
import UserDash from "../../../../public/Assets/UserDash.png";
import { authClient } from "@/lib/auth-client";
import { userDetails, purchaseHistory } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-50/50 min-h-screen">
      {/* Banner Skeleton */}
      <div className="relative bg-slate-200/70 rounded-[24px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden border border-slate-200/30 min-h-[250px]">
        <div className="space-y-4 w-full md:max-w-xl flex flex-col items-center md:items-start">
          <div className="h-8 bg-slate-300 rounded-md w-2/3 animate-pulse" />
          <div className="w-full space-y-2 flex flex-col items-center md:items-start">
            <div className="h-4 bg-slate-300 rounded-md w-full max-w-md animate-pulse" />
            <div className="h-4 bg-slate-300 rounded-md w-5/6 max-w-sm animate-pulse" />
          </div>
          <div className="pt-2">
            <div className="h-11 bg-slate-300 rounded-full w-36 animate-pulse" />
          </div>
        </div>
        <div className="relative w-44 h-44 md:w-52 md:h-52 bg-slate-300 rounded-[24px] border-4 border-white shadow-md animate-pulse" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
              <div className="w-20 h-5 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded-md w-1/2 animate-pulse" />
              <div className="h-7 bg-slate-200 rounded-md w-1/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const session = await authClient.getSession();
        const users = await userDetails();

        const email = session?.user?.email || session?.data?.user?.email;

        const currentUser = users.find((u) => u.email === email);

        setUser(currentUser);

        if (!currentUser) {
          setIsLoading(false);
          return;
        }

        const history = await purchaseHistory(currentUser._id);

        const myPurchases = history;

        setUser(currentUser);
        setPurchases(myPurchases);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const plan = user?.subscription?.plan;

  const limit = user?.subscription?.purchaseLimit;

  const purchased = user?.subscription?.purchasedThisMonth;

  const remaining = limit === -1 ? "Unlimited" : limit - purchased;

  const progress = limit === -1 ? 0 : (purchased / limit) * 100;

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-50/50 min-h-screen">
      {/* WELCOME BANNER BOX */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-[#E3ECFF] rounded-[24px] p-6 md:p-10 text-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden border border-slate-200/30 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
      >
        {/* Left Side Content */}
        <div className="space-y-4 md:max-w-xl text-center md:text-left z-10">
          <h1 className="text-xl md:text-2xl font-medium text-slate-800 tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-md">
            Your collection is expanding! Explore the newest additions from your
            favorite artists in the gallery
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#f4f7fd] text-slate-600 font-medium px-6 py-3 rounded-full hover:bg-slate-100 transition-colors duration-200 text-sm border border-slate-200/60"
            >
              View Collection
            </motion.button>
          </div>
        </div>

        {/* Right Side Image with Hover Animation */}
        <div className="relative w-44 h-44 md:w-52 md:h-52 z-10 flex items-center justify-center">
          <motion.div
            className="w-full h-full rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] border-4 border-white"
            initial={{ rotate: 10 }}
            whileHover={{ rotate: 0, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
          >
            <Image
              src={UserDash}
              alt="User Dashboard Illustration"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 3 STATS CARDS SECTION */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* Card 1: Purchased Artworks */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[140px] transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-[#f5efff] rounded-xl text-[#6211cf]">
              <Palette className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Purchased Artworks
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {purchases.length}
            </h3>
          </div>
        </motion.div>

        {/* Card 2: Remaining Limit */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[140px] transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
              <ListTodo className="w-5 h-5" />
            </div>
            {/* Progress Bar */}
            <div className="w-20 bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#6211cf] h-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Remaining Limit
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {purchased} / {limit === -1 ? "∞" : limit}
            </h3>
          </div>
        </motion.div>

        {/* Card 3: Current Plan Only */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[140px] transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-[#f5efff] rounded-xl text-[#6211cf]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#6211cf] bg-[#f5efff] px-2 py-0.5 rounded-md uppercase tracking-wide">
              {plan}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Current Plan
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {plan === "free"
                ? "Free Plan"
                : plan === "pro"
                  ? "Pro Plan"
                  : "Premium Plan"}
            </h3>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserDashboardPage;
