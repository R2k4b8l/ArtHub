"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { artworkCollection } from "@/lib/data";
import Image from "next/image";
import {
  Palette,
  Laptop,
  Gem,
  Camera,
  Mountain,
  Building2,
  TreeDeciduous,
  Snowflake,
  Droplets,
  Flower,
} from "lucide-react";
import { motion } from "framer-motion";
import { CategorySkeleton } from "./Skeleton";

const iconMap = {
  Water: <Droplets size={32} />,
  Floral: <Flower size={32} />,
  Winter: <Snowflake size={32} />,
  Cityscape: <Building2 size={32} />,
  Landscape: <Mountain size={32} />,
  "Digital Art": <Laptop size={32} />,
  Painting: <Palette size={32} />,
  Sculpture: <Gem size={32} />,
  Photography: <Camera size={32} />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allArtworks = await artworkCollection();
        const artworks = allArtworks.artworks || allArtworks;

        const availableArtworks = artworks.filter(
          (art) => art.status?.toLowerCase() === "available"
        );

        const categoryCounts = availableArtworks.reduce((acc, art) => {
          acc[art.category] = (acc[art.category] || 0) + 1;
          return acc;
        }, {});

        const topCategories = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => {
            const artwork = availableArtworks.find((art) => art.category === name);

            return {
              name,
              count,
              image: artwork?.image,
              icon: iconMap[name] || <Palette size={32} />,
            };
          });

        setCategories(topCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <CategorySkeleton />;
  }

  return (
    <section className="py-12 px-4 max-w-[80%] mx-auto overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-10 text-center text-slate-900"
      >
        Explore Collections
      </motion.h2>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.04, y: -4 }}
            className="relative h-56 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 block group"
          >
            <Link
              href={`/artworks?category=${encodeURIComponent(cat.name)}&status=available`}
              className="w-full h-full block"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 16vw"
                  className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-800" />
              )}

              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-all duration-300" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center text-white p-4 text-center">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="mb-3 text-purple-200"
                >
                  {cat.icon}
                </motion.div>

                <h3 className="font-bold text-lg sm:text-xl tracking-tight">{cat.name}</h3>

                <p className="text-xs sm:text-sm mt-1.5 opacity-90 font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                  {cat.count} Artworks
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Category;
