"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Images
import Hero1 from "../../public/Assets/Hero1.png";
import Hero2 from "../../public/Assets/Hero2.png";
import Hero3 from "../../public/Assets/Hero3.png";
import HeroTooltip1 from "../../public/Assets/ToolTip1.png";
import HeroTooltip2 from "../../public/Assets/ToolTip2.png";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Discover & Buy",
      titleHighlight: "Original Art",
      highlightColor: "text-[#B4136D]",
      btnBg: "bg-[#B4136D] hover:bg-[#910f56] shadow-[0_24px_80px_rgba(180,19,109,0.4)]",
      description:
        "Explore a curated selection of global masterpieces from independent creators to world-renowned masters, handpicked to inspire your unique artistic taste and vision.",
      image: Hero1,
    },
    {
      id: 2,
      title: "Support",
      titleHighlight: "Creative Minds",
      highlightColor: "text-fuchsia-500",
      btnBg: "bg-fuchsia-600 hover:bg-fuchsia-500 shadow-[0_24px_80px_rgba(217,70,239,0.4)]",
      description:
        "Every purchase you make directly empowers the artist behind the work. Join our vibrant community that values transparency, creative freedom, and sustainable growth.",
      image: Hero2,
    },
    {
      id: 3,
      title: "Find Your Next",
      titleHighlight: "Masterpiece",
      highlightColor: "text-cyan-400",
      btnBg: "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_24px_80px_rgba(34,211,238,0.3)]",
      description:
        "Art that truly resonates with your inner soul. Easily search by style, medium, or color to discover the perfect addition that completes your personal collection.",
      image: Hero3,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1,
      );
    }, 5500);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full overflow-hidden min-h-[100vh] lg:min-h-[calc(100vh-72px)] bg-slate-950 flex items-center">
      {/* Background & Text Synchronized Transition*/}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image scaling style */}
            <motion.div
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                sizes="100vw"
                className="object-cover object-[50%_50%]"
                priority
              />
            </motion.div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent max-lg:bg-slate-950/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 mx-auto w-full max-w-[80%] py-12 md:py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
          
          {/* Left Side Content */}
          <div className="flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
            
            {/* Main Shared AnimatePresence Wrapper for Full Left Side Sync */}
            <div className="w-full h-auto min-h-[340px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[auto] flex flex-col justify-center items-center lg:items-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 25 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="flex flex-col items-center lg:items-start"
                >
                  {/* Top Line Tag Line */}
                  <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-violet-400 mb-4 font-semibold">
                    Explore curated digital art
                  </p>

                  {/* Dynamic Heading */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[56px] xl:text-[64px] font-extrabold text-white leading-[1.15] tracking-tight">
                    {slides[currentSlide].title} <br />
                    <span className={slides[currentSlide].highlightColor}>
                      {slides[currentSlide].titleHighlight}
                    </span>
                  </h1>

                  {/* Dynamic Description Paragraph */}
                  <p className="mt-6 max-w-xl text-sm sm:text-base md:text-lg text-slate-300/90 leading-relaxed balance">
                    {slides[currentSlide].description}
                  </p>

                  {/* Dynamic Colored CTA Button */}
                  <div className="mt-8 sm:mt-10">
                    <Link href="/">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className={`inline-flex items-center gap-3 rounded-full px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold transition-all duration-300 group cursor-pointer ${
                          slides[currentSlide].btnBg
                        } ${currentSlide === 2 ? 'text-slate-950' : 'text-white'}`}
                      >
                        Browse Artworks
                        <ArrowRight
                          size={18}
                          className="transform group-hover:translate-x-1 transition-transform"
                        />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] flex items-center justify-center lg:justify-end mt-8 lg:mt-25">
            {/* Background Blurs */}
            <div className="absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-violet-500/20 blur-[80px] pointer-events-none" />
            <div className="absolute left-1/4 bottom-1/4 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-[80px] pointer-events-none" />

            {/* Tooltip 2 (Back Card) */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [-4, -2, -4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.03, rotate: -1, zIndex: 40 }}
              className="absolute right-[15%] sm:right-[20%] lg:right-16 top-4 w-[160px] h-[220px] sm:w-[220px] sm:h-[300px] lg:w-[240px] lg:h-[320px] rounded-[24px] sm:rounded-[32px] bg-slate-950/80 border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-sm cursor-pointer"
            >
              <Image
                src={HeroTooltip2}
                alt="Art Card Back"
                fill
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 240px"
                priority
                className="object-cover p-2 rounded-[24px] sm:rounded-[32px]"
              />
            </motion.div>

            {/* Tooltip 1 (Front Card) */}
            <motion.div
              animate={{
                y: [0, 12, 0],
                rotate: [6, 8, 6],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              whileHover={{ scale: 1.05, rotate: 2, zIndex: 40 }}
              className="absolute right-[5%] sm:right-[10%] lg:right-0 top-16 w-[150px] h-[210px] sm:w-[200px] sm:h-[280px] lg:w-[220px] lg:h-[300px] rounded-[24px] sm:rounded-[32px] bg-white shadow-[0_32px_90px_rgba(0,0,0,0.3)] overflow-hidden cursor-pointer"
            >
              <Image
                src={HeroTooltip1}
                alt="Art Card Front"
                fill
                sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 220px"
                priority
                className="object-cover p-1.5 rounded-[24px] sm:rounded-[32px]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;