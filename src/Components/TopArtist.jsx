"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { topArtists } from "@/lib/data";
import { motion } from "framer-motion";
import { TopArtistSkeleton } from "./Skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const artistVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 25 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

const TopArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const topArtistsData = await topArtists();
        setArtists(topArtistsData);
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return <TopArtistSkeleton />;
  }

  return (
    <section className="w-full max-w-[90%] md:max-w-[80%] mx-auto bg-[#f5f7ff] py-10 md:py-16 px-4 md:px-8 rounded-3xl border border-purple-200 my-12 overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">Top Artist</h2>
        <p className="text-sm md:text-base text-gray-500">
          The visionary minds shaping the future of digital and physical art.
        </p>
      </motion.div>

      {/* Artist Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10"
      >
        {artists.map((artist, index) => (
          <motion.div 
            key={artist.id || index} 
            variants={artistVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center p-6 bg-white/40 hover:bg-white backdrop-blur-xs border border-transparent hover:border-purple-100 rounded-3xl hover:shadow-[0_12px_24px_-10px_rgba(124,58,237,0.1)] transition-all duration-300 cursor-pointer"
          >
            {/* Circular Image */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-28 h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white"
            >
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>

            {/* Info */}
            <h3 className="font-bold text-lg text-slate-800 text-center truncate w-full">{artist.name}</h3>
            <p className="text-sm text-gray-600 mb-4 text-center mt-1">
              {artist.artworks} Artworks • {artist.sales} Sold
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default TopArtist;