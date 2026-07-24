"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { getInitials, isRemote } from '@/lib/avatar';
import { LayoutGrid, ShoppingBag, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardSkeleton } from '@/Components/Skeleton';
import { purchaseHistory } from '@/lib/data';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const ArtistDashboardpage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const profileImg = user?.image?.trim() ? user.image : null;
  const [stats, setStats] = useState({ total: 0, sold: 0, available: 0, ready: false });
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    let isCancelled = false;

    const loadStats = async () => {
      try {
        const res = await fetch(`${backendUrl}/artworks?artistId=${encodeURIComponent(user.id)}`);
        const data = await res.json();
const artworks = Array.isArray(data) ? data : data.artworks || [];

const total = artworks.length;
const sold = artworks.filter((art) => art.isSold || art.status?.toLowerCase() === 'sold').length;
const available = Math.max(0, total - sold);

// revenue calculate
const sales = await purchaseHistory(undefined, user.id);

const salesData = Array.isArray(sales) ? sales : [];

const totalRevenue = salesData.reduce(
  (sum, item) => sum + (item.price || 0),
  0
);

        if (!isCancelled) {
          setStats({ total, sold, available, ready: true });
          setRevenue(totalRevenue);
        }
      } catch (error) {
        console.error('Failed to load artist stats:', error);
        if (!isCancelled) {
          setStats({ total: 0, sold: 0, available: 0, ready: true });
        }
      }
    };

    loadStats();
    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const dashboardData = {
    artistName: user?.name || 'Artist',
    subtitle: user
      ? `Welcome back to your studio, ${user.name.split(' ')[0] || 'Artist'}. Manage your gallery and track your artistic success.`
      : 'Where vision meets execution. Manage your gallery and track your artistic success.',
    profileImg: user?.image || null,
    stats: [
      {
        id: 1,
        label: 'LIFETIME',
        title: 'Total Artworks',
        value: stats.total,
        icon: <LayoutGrid className="w-5 h-5 text-teal-600" />,
        progress: stats.ready ? 100 : 0,
      },
      {
        id: 2,
        label: 'ACTIVE',
        title: 'Available Artworks',
        value: stats.available,
        icon: <ShoppingBag className="w-5 h-5 text-teal-600" />,
        progress: stats.ready && stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0,
      },
      {
  id: 3,
  label: 'SUCCESS',
  title: 'Total Revenue',
  value: `$${revenue}`,
  icon: <DollarSign className="w-5 h-5 text-teal-600" />,
  progress: 100,
},
    ]
  };

  if (isPending || !stats.ready) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-sans"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* --- Header --- */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
        >
          <div className="p-1 rounded-xl border-2 border-purple-300 shadow-sm bg-white overflow-hidden">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
              {dashboardData.profileImg ? (
                <Image
                  src={dashboardData.profileImg}
                  alt={dashboardData.artistName}
                  fill
                  sizes="96px"
                  unoptimized={isRemote(dashboardData.profileImg)}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white text-3xl font-extrabold tracking-wider select-none">
                  {getInitials(dashboardData.artistName)}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Welcome Back, {dashboardData.artistName}!
            </h1>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
              {dashboardData.subtitle}
            </p>
          </div>
        </motion.div>

        {/* --- Stats --- */}
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {dashboardData.stats.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[180px]"
            >
              
              <div className="flex justify-between items-start">
                <div className="p-3 bg-teal-50/60 rounded-xl">
                  {stat.icon}
                </div>
                
                <span className={`text-xs font-bold tracking-wider ${
                  stat.label === 'SUCCESS' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {stat.label}
                </span>
              </div>

              
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </span>
                <p className="text-xs text-gray-500 font-medium">
                  {stat.title}
                </p>
              </div>

              
              <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default ArtistDashboardpage;