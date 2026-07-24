"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { purchaseHistory } from '@/lib/data';
import { useSession } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
};

const GallerySkeleton = () => {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded-md w-48 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded-md w-72 animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col h-[380px]">
            <div className="relative w-full h-[240px] bg-slate-200 flex items-center justify-center animate-pulse">
              <ImageIcon className="w-10 h-10 text-slate-300" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded-md w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2 animate-pulse" />
              </div>
              <div className="h-10 bg-slate-200 rounded-xl w-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserDashboardBoughtArtworkPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: session } = useSession();

const [purchasedArtworks, setPurchasedArtworks] = useState([]);

  useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);

      if (!session?.user?.id) return;

      const data = await purchaseHistory(session.user.id);

      const list = Array.isArray(data) ? data : data?.data || [];

      setPurchasedArtworks(list);
    } catch (err) {
      setPurchasedArtworks([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadData();
}, [session?.user?.id]);


  // pagination
  const totalPages = Math.ceil(purchasedArtworks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchasedArtworks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <GallerySkeleton />;
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen bg-slate-50/50 flex flex-col justify-between">
      
      <div className="space-y-6 w-full">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
            Bought Artworks
          </h1>
          <p className="text-slate-500 text-sm">
            A collection of all your premium purchased masterpiece pieces.
          </p>
        </div>

        {/* RESPONSIVE GALLERY GRID */}
        {/* RESPONSIVE GALLERY GRID */}
{purchasedArtworks.length === 0 ? (
  <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl bg-white p-8 text-center">
    <div className="bg-slate-50 p-4 rounded-full mb-4">
      <PackageSearch className="w-10 h-10 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800">No Artworks Found</h3>
    <p className="text-slate-500 text-sm mt-1 max-w-xs">
      You haven't purchased any masterpieces yet. Explore our gallery to find your first one!
    </p>
    <Link 
      href="/artworks" 
      className="mt-6 px-6 py-2.5 bg-[#6211cf] text-white rounded-xl font-medium hover:bg-[#500ea8] transition-colors"
    >
      Explore Gallery
    </Link>
  </div>
) : (
  <motion.div
    key={currentPage}
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    {currentItems.map((artwork, index) => (
      <motion.div
        key={`${artwork.artworkId}-${index}`}
        variants={itemVariants}
        whileHover={{ y: -6 }}
        className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 flex flex-col h-[380px]"
      >
        {/* ইমেজের অংশ */}
        <div className="relative w-full h-[240px] bg-slate-100 overflow-hidden">
          <Image
            src={artwork.artworkImage}
            alt={artwork.artworkTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            unoptimized
          />
        </div>
        {/* ডিটেইলসের অংশ */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800 line-clamp-1 group-hover:text-[#6211cf] transition-colors duration-200">
              {artwork.artworkTitle}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Purchased Value: <span className="text-slate-600 font-semibold">{artwork.price}</span>
            </p>
          </div>
          <Link 
            href={`/artworks/${artwork.artworkId}`}
            className="w-full flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-[#6211cf] text-slate-600 hover:text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-200 border border-slate-200/60 hover:border-[#6211cf] shadow-sm"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.div>
    ))}
  </motion.div>
)}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 pb-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-[#6211cf] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboardBoughtArtworkPage;