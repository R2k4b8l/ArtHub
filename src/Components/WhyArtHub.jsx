"use client";

import React from 'react';
import { ShieldCheck, UserCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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
      stiffness: 80,
      damping: 14,
    },
  },
};

const WhyArtHub = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
      title: "Secure Payments",
      description: "Blockchain-backed transactions ensuring every trade is final, secure, and transparent.",
    },
    {
      icon: <UserCheck className="w-8 h-8 text-purple-600" />,
      title: "Verified Artists",
      description: "We vet every artist to maintain the highest standard of originality and quality on our platform.",
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Global Market",
      description: "Connect with collectors and creators from over 150 countries in a truly global ecosystem.",
    },
  ];

  return (
    <section className="w-full max-w-[90%] md:max-w-[80%] mx-auto py-16 overflow-hidden">
      {/* Section Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900">Why ArtHub?</h2>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-pointer"
          >
            {/* Icon Box */}
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6"
            >
              {item.icon}
            </motion.div>

            {/* Content */}
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {item.title}
            </h3>
            <p className="text-slate-600 leading-relaxed text-[15px]">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhyArtHub;