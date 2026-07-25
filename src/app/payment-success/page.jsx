"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found in the URL.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-payment/${sessionId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify payment");
        }

        setMetadata(data.metadata);
        
        await authClient.getSession();
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.message || "Failed to verify payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          Verifying your payment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center max-w-md mx-auto p-8 bg-white border border-red-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-in fade-in duration-200">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Verification Failed</h2>
        <p className="text-slate-500 mb-6 font-medium text-sm leading-relaxed">{error}</p>
        <Link
          href="/artworks"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(139,92,246,0.15)] text-center relative overflow-hidden"
    >
      {/* Decorative gradient blur background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Success Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
        Payment Successful!
      </h1>
      <p className="text-slate-500 font-medium text-sm mb-8 px-4 leading-relaxed">
        Thank you for your purchase. Your transaction has been completed and verified.
      </p>

      {/* Purchase Details */}
      {metadata && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Transaction Details
          </h3>
          {metadata.type === "artwork" ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">Purchased Item</span>
                <span className="text-slate-800 font-bold max-w-[200px] truncate">Artwork Purchase</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">Buyer</span>
                <span className="text-slate-800 font-bold">{metadata.buyerName}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">Plan Purchased</span>
                <span className="text-slate-800 font-bold capitalize">
                  {metadata.plan} Plan
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">Type</span>
                <span className="text-slate-800 font-bold">Subscription Upgrade</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-violet-500/10 transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <Link
          href="/artworks"
          className="w-full text-slate-500 hover:text-slate-700 font-bold text-sm py-2 transition"
        >
          Continue Browsing
        </Link>
      </div>
    </motion.div>
  );
};

export default function PaymentSuccessPage() {
  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 antialiased flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Loading payment details...</p>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
