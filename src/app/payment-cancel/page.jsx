"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 antialiased flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(239,68,68,0.1)] text-center relative overflow-hidden"
      >
        {/* Decorative gradient blur background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Cancel Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"
        >
          <XCircle className="w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
          Payment Cancelled
        </h1>
        <p className="text-slate-500 font-medium text-sm mb-8 px-4 leading-relaxed">
          Your payment was cancelled and no charges were made. You can try again whenever you are ready.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            href="/artworks"
            className="w-full text-slate-500 hover:text-slate-700 font-bold text-sm py-2 transition"
          >
            Browse Marketplace
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
