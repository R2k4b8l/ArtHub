"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../../../public/Assets/Logo.png';
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

// Lucide Icons Import
import { 
  LayoutDashboard, 
  Palette, 
  PlusCircle, 
  History, 
  UserCircle, 
  Home, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const ArtistDashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace('/sign-in');
      } else if (session.user?.role !== 'artist') {
        router.replace('/unauthorized');
      }
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out!");
      router.push('/sign-in');
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard/artist', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Manage Artwork', href: '/dashboard/artist/manage-artwork', icon: <Palette className="w-5 h-5" /> },
    { name: 'Add Artwork', href: '/dashboard/artist/add-artwork', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Sales History', href: '/dashboard/artist/sales-history', icon: <History className="w-5 h-5" /> },
    { name: 'Profile', href: '/dashboard/artist/profile', icon: <UserCircle className="w-5 h-5" /> },
  ];

  // Sidebar Content 
  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full p-6 bg-white select-none">
      
      {/* LOGO & LINKS */}
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-between px-2 py-3">
          <Image 
            src={Logo} 
            alt="ArtHub Logo" 
            width={130} 
            height={40} 
            priority
            className="object-contain"
          />
          {/* Close button for sm device */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-colors duration-200 relative z-10 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:bg-purple-50/50 hover:text-purple-600'
                }`}
              >
                {/* Active Tab Slide Animation */}
                {isActive && (
                  <motion.div 
                    layoutId="activeArtistIndicator"
                    className="absolute inset-0 bg-[#7C3AED] rounded-xl shadow-md shadow-purple-200 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.icon}
                <span className="text-[15px]">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-slate-100 pt-4 space-y-1">
        {/* Home Button */}
        <button 
          onClick={() => {
            setIsMobileOpen(false);
            router.push('/');
          }}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          <span className="text-[15px]">Home</span>
        </button>

        {/* Logout Button */}
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[15px]">Logout</span>
        </button>
      </div>
    </div>
  );

  if (isPending || !session || session.user?.role !== 'artist') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 w-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-semibold text-slate-600">Verifying artist access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden">
      
      {/* DESKTOP VIEWPORT */}
      <aside className="hidden lg:block w-64 border-r border-slate-100 bg-white sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* MOBILE & TABLET VIEWPORT */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark Overlay Background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Sliding Sidebar Body */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-2xl lg:hidden h-screen"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN APP AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Top Header */}
        <header className="lg:hidden w-full bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-30">
          <Image 
            src={Logo} 
            alt="ArtHub Logo" 
            width={100} 
            height={32} 
            className="object-contain"
          />
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Inner Pages Render Area */}
        <main className="flex-1 p-4 md:p-6 bg-[#F8FAFC] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ArtistDashboardLayout;