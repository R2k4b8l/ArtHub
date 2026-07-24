"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { updateSubscription } from "@/lib/data";
import toast from "react-hot-toast";

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const SubscriptionSkeleton = () => {
  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      {/* Header Skeleton */}
      <div className="space-y-2 text-center max-w-md mx-auto">
        <div className="h-8 bg-slate-200 rounded-md w-3/4 mx-auto animate-pulse" />
        <div className="h-4 bg-slate-200 rounded-md w-full mx-auto animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[420px]"
          >
            <div className="space-y-6">
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="h-5 bg-slate-200 rounded-md w-24 animate-pulse" />
                <div className="h-8 bg-slate-200 rounded-md w-32 animate-pulse" />
              </div>
              {/* Price */}
              <div className="h-12 bg-slate-200 rounded-md w-28 animate-pulse" />
              {/* Features */}
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-slate-200 rounded-md w-5/6 animate-pulse" />
                <div className="h-4 bg-slate-200 rounded-md w-4/5 animate-pulse" />
                <div className="h-4 bg-slate-200 rounded-md w-2/3 animate-pulse" />
              </div>
            </div>
            {/* Button */}
            <div className="h-11 bg-slate-200 rounded-xl w-full mt-8 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

const UserSubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const [currentPlan, setCurrentPlan] = useState(
    session?.user?.subscription?.plan || "free",
  );

  useEffect(() => {
    if (session?.user?.subscription?.plan) {
      setCurrentPlan(session.user.subscription.plan);
    }
  }, [session]);

  const handleSubscription = async (plan) => {
    if (!session?.user?.id) {
      toast.error("Please login first");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-checkout/subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            plan: plan,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe checkout URL is missing");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const subscriptionTiers = [
    {
      id: "free",
      name: "Free",
      badge: "Default Plan",
      price: "$0",
      period: "per month",
      limit: "3 paintings",
      features: [
        "Access to public gallery",
        "Basic profile customization",
        "Standard support",
      ],
      icon: <Zap className="w-5 h-5 text-slate-500" />,
      buttonText: "Current Plan",
      isCurrent: true,
      isPopular: false,
    },
    {
      id: "pro",
      name: "Pro",
      badge: "Most Popular",
      price: "$9.99",
      period: "per month",
      limit: "9 paintings",
      features: [
        "Expanded portfolio view",
        "Advanced analytics",
        "Priority email support",
        "No intrusive ads",
      ],
      icon: <Sparkles className="w-5 h-5 text-[#6211cf]" />,
      buttonText: "Upgrade to Pro",
      isCurrent: false,
      isPopular: true,
    },
    {
      id: "premium",
      name: "Premium",
      badge: "Ultimate Power",
      price: "$19.99",
      period: "per month",
      limit: "Unlimited paintings",
      features: [
        "All Pro features included",
        "Featured artist badge",
        "24/7 Dedicated support",
        "Early access to new tools",
      ],
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      buttonText: "Go Premium",
      isCurrent: false,
      isPopular: false,
    },
  ];

  if (isLoading) {
    return <SubscriptionSkeleton />;
  }

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen bg-slate-50/50">
      {/* PAGE HEADER */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Subscription Plans
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Choose the right plan to expand your art gallery and unlock elite
          features.
        </p>
      </div>

      {/* RESPONSIVE CARDS GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4"
      >
        {subscriptionTiers.map((tier) => {
          const isCurrent = currentPlan === tier.id;

          const isDisabled =
            tier.id === "free" ||
            isCurrent ||
            (currentPlan === "premium" && tier.id === "pro");

          const buttonText = isCurrent
            ? "Current Plan"
            : tier.id === "free"
              ? "Free Plan"
              : tier.id === "pro"
                ? "Upgrade to Pro"
                : "Go Premium";

          return (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className={`relative bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 border ${
                tier.isPopular
                  ? "border-[#6211cf] shadow-[0_10px_30px_rgba(98,17,207,0.08)]"
                  : "border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md"
              }`}
            >
              <div className="absolute top-6 right-6">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    tier.isPopular
                      ? "bg-[#f5efff] text-[#6211cf]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCurrent ? "Current Plan" : tier.badge}
                </span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div
                    className={`p-2.5 w-fit rounded-xl ${
                      tier.id === "free"
                        ? "bg-slate-100"
                        : tier.id === "pro"
                          ? "bg-[#f5efff]"
                          : "bg-emerald-50"
                    }`}
                  >
                    {tier.icon}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline text-slate-800">
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="ml-1 text-sm font-medium text-slate-400">
                    /{tier.period}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border text-sm font-semibold ${
                    tier.isPopular
                      ? "bg-[#f5efff]/40 border-[#6211cf]/20 text-[#6211cf]"
                      : "bg-slate-50 border-slate-100 text-slate-700"
                  }`}
                >
                  Max Purchases: {tier.limit}
                </div>

                <ul className="space-y-3 pt-2">
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-500"
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          tier.isPopular ? "text-[#6211cf]" : "text-slate-400"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscription(tier.id)}
                disabled={isDisabled}
                className={`w-full mt-8 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  isDisabled
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    : tier.isPopular
                      ? "bg-[#6211cf] hover:bg-[#520eb0] text-white border-[#6211cf] shadow-md shadow-purple-200"
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                }`}
              >
                {buttonText}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default UserSubscriptionPage;
