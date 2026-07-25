"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 text-center border border-slate-100">
        
        {/* Animated Icon Container */}
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        {/* Error Messages */}
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Access Denied
        </h1>
        <p className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">
          Error 403: Unauthorized
        </p>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Oops! Looks like you don't have the required permission to access this dashboard. Let's get you back to safety.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all active:scale-95 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] text-white font-medium hover:opacity-95 transition-all active:scale-95 shadow-md shadow-purple-500/20 cursor-pointer text-sm">
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UnauthorizedPage;