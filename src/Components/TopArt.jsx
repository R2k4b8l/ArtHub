"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { artworkCollection } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TopArtSkeleton } from "./Skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 14,
    },
  },
};

const TopArt = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const topArtworks = await artworkCollection({
          status: "available",
          limit: 7
        });
        setArtworks(topArtworks);
      } catch (err) {
        console.error("Error fetching top artworks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArt();
  }, []);

  const getGridClass = (index) => {
    switch (index) {
      case 0:
        return "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 lg:row-span-2";
      default:
        return "col-span-1";
    }
  };

  if (loading) {
    return <TopArtSkeleton />;
  }

  return (
    <section className="w-full bg-slate-50 py-20 overflow-hidden">
      <div className="max-w-[80%] mx-auto">
        {/* Header animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2 text-slate-900">Featured Masterpieces</h2>
            <p className="text-gray-500">
              Our weekly curation of high-potential digital assets and physical works.
            </p>
          </div>
          <Link
            href="/artworks"
            className="text-purple-600 font-semibold hover:underline flex items-center gap-1 whitespace-nowrap group"
          >
            View Gallery 
            <ArrowRight 
              size={18} 
              className="transform group-hover:translate-x-1 transition-transform" 
            />
          </Link>
        </motion.div>

        {/* Grid animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]"
        >
          {artworks.map((art, index) => (
            <motion.div
              key={art._id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative bg-white p-2 border border-slate-200 rounded-3xl overflow-hidden group shadow-sm hover:shadow-md hover:border-purple-300 transition-colors duration-300 ${getGridClass(index)}`}
            >
              <Link href={`/artworks/${art._id}`} className="block w-full h-full relative overflow-hidden rounded-2xl">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Visual hover caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 pt-10 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-end text-white">
                  <h3 className="font-bold text-sm sm:text-base truncate">{art.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-300">by {art.artistName}</span>
                    <span className="text-sm font-extrabold text-purple-400">${art.price?.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopArt;