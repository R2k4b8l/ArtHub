"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon, ChevronDown, } from "lucide-react";
import Logo from "../../public/Assets/Logo.png";
import { useSession, signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.id]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const profileImg = user?.image?.trim() && !imageError ? user.image : null;
  const dashboardLink = user?.role ? `/dashboard/${user.role}` : "/dashboard";

  const profileLink = user?.role
    ? `/dashboard/${user.role}/profile`
    : "/dashboard";

  if (pathname && pathname.includes("dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getLinkClass = (path, isMobile = false) => {
    const isActive = pathname === path;

    if (isMobile) {
      return isActive
        ? "text-violet-600 font-semibold bg-violet-50 px-4 py-2 rounded-xl transition"
        : "text-gray-600 hover:text-black hover:bg-gray-50 px-4 py-2 rounded-xl transition";
    }

    return isActive
      ? "text-violet-600 border-b-2 border-violet-600 pb-1 font-semibold"
      : "text-gray-600 hover:text-black transition pb-1 hover:border-b-2 hover:border-gray-300";
  };

  return (
    <div
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
          : "bg-white/30 backdrop-blur-md shadow-none"
      }`}
    >
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto h-[72px] grid grid-cols-2 lg:grid-cols-3 items-center">
        {/* Logo */}
        <div className="flex items-center justify-start">
          <Link href="/">
            <div className="flex items-center shrink-0 hover:opacity-90 transition">
              <Image
                src={Logo}
                alt="ArtHub Logo"
                width={120}
                height={120}
                className="object-contain w-auto h-auto"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center">
          <nav>
            <ul className="flex items-center gap-10 text-[16px] font-medium">
              <Link href="/" className={getLinkClass("/")}>
                Home
              </Link>
              <Link href="/artworks" className={getLinkClass("/artworks")}>
                Browse Artworks
              </Link>
              <Link href={dashboardLink} className={getLinkClass("/dashboard")}>
                Dashboard
              </Link>
            </ul>
          </nav>
        </div>

        {/* Profile Dropdown & Hamburger */}
        <div className="flex items-center justify-end gap-4">
          {/* Desktop Auth */}
          <div className="hidden lg:block">
            {isPending ? (
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition focus:outline-none cursor-pointer"
                >
                  {/* Avatar Section */}
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-500 shadow-sm shrink-0 flex items-center justify-center">
                    {profileImg ? (
                      <Image
                        src={profileImg}
                        alt={user.name || "User Profile"}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        unoptimized={profileImg.startsWith("http")}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white text-sm font-extrabold tracking-wider shadow-inner select-none">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      ></div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2.5 w-56 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl py-2 z-20 origin-top-right"
                      >
                        <Link
                          href={profileLink}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium transition first:rounded-t-2xl"
                        >
                          <UserIcon size={16} className="text-slate-400" />
                          Profile
                        </Link>

                        <Link
                          href={dashboardLink}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                        >
                          <LayoutDashboard
                            size={16}
                            className="text-slate-400"
                          />
                          Dashboard
                        </Link>

                        <div className="border-t border-slate-100 my-1"></div>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition text-left cursor-pointer last:rounded-b-2xl"
                        >
                          <LogOut size={16} className="text-red-500" />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/sign-in">
                <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white text-sm font-medium hover:opacity-95 transition-all active:scale-95 shadow-md shadow-purple-500/10 cursor-pointer">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Hamburger Button for Mobile */}
          <div
            className="lg:hidden block cursor-pointer p-1 text-black hover:bg-gray-50 rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-[73px] left-0 w-full bg-white/80 backdrop-blur-xl shadow-lg lg:hidden z-50 overflow-hidden"
          >
            <div className="max-w-[90%] md:max-w-[85%] mx-auto py-6 flex flex-col gap-6">
              <nav>
                <ul className="flex flex-col gap-2 text-[16px] font-medium">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className={getLinkClass("/", true)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/artworks"
                    onClick={() => setIsOpen(false)}
                    className={getLinkClass("/artworks", true)}
                  >
                    Browse Artworks
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={getLinkClass("/dashboard", true)}
                  >
                    Dashboard
                  </Link>
                </ul>
              </nav>

              {/* Mobile Auth View */}
              {user ? (
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    {/* Mobile Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-500 flex items-center justify-center shrink-0">
                      {profileImg ? (
                        <Image
                          src={profileImg}
                          alt={user.name || "User Profile"}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                          unoptimized={profileImg.startsWith("http")}
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white text-sm font-extrabold tracking-wider shadow-inner select-none">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {user.name}
                    </span>
                  </div>

                  <Link
                    href={profileLink}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition"
                  >
                    <UserIcon size={16} className="text-slate-400" />
                    Profile
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition"
                  >
                    <LayoutDashboard size={16} className="text-slate-400" />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold transition text-left cursor-pointer"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4">
                  <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                    <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white font-medium transition-all text-center active:scale-95 hover:opacity-95 shadow-md shadow-purple-500/10">
                      Sign In
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;