"use client";

import React from 'react';
import { motion } from 'framer-motion';

const JoinArtHub = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, type: "spring", stiffness: 70 }}
      className="w-full max-w-[90%] md:max-w-[80%] mx-auto my-20 py-20 px-6 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 text-center overflow-hidden"
    >
      {/* Title */}
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight"
      >
        Join the ArtHub Community
      </motion.h2>
      
      {/* Description */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-2xl mx-auto text-slate-600 text-lg leading-relaxed mb-10"
      >
        Whether you're a visionary creator looking to showcase your masterpieces or 
        a discerning collector seeking the next global gem, ArtHub is your home for 
        premium digital art.
      </motion.p>
      
      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-center gap-4"
      >
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          Get Started
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-10 py-3.5 rounded-full font-semibold transition-all duration-300 border border-slate-200 cursor-pointer"
        >
          Learn More
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default JoinArtHub;