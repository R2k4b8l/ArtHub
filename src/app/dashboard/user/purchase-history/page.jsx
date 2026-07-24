"use client";

import React, { useState, useEffect } from 'react';
import { purchaseHistory, getSubscriptionHistory } from '@/lib/data';
import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const UserDashboardPurchaseHistoryPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [activeTab, setActiveTab] = useState('artworks'); // 'artworks' | 'subscriptions'

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        if (!session?.user?.id) return;

        const [artData, subData] = await Promise.all([
          purchaseHistory(session.user.id),
          getSubscriptionHistory(session.user.id)
        ]);

        setPurchaseData(Array.isArray(artData) ? artData : []);
        setSubscriptionData(Array.isArray(subData) ? subData : []);
      } catch (err) {
        setPurchaseData([]);
        setSubscriptionData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session?.user?.id]);

  const TableSkeleton = () => {
    return Array(4).fill(0).map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0" />
            <div className="h-4 bg-slate-200 rounded w-28" />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-6 bg-slate-200 rounded-full w-20" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-slate-200 rounded w-14" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-slate-200 rounded w-24" />
        </td>
      </tr>
    ));
  };

  const getPlanPrice = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'pro': return '$9.99';
      case 'premium': return '$19.99';
      default: return '$0.00';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-50/50 min-h-screen space-y-6">
      
      {/* HEADING TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
            Billing & Purchase History
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Review and manage your previously purchased masterpieces and subscriptions.
          </p>
        </div>
      </div>

      {/* TAB SELECTORS */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('artworks')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'artworks'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Artworks ({purchaseData.length})
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Subscriptions ({subscriptionData.length})
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          {activeTab === 'artworks' ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Artwork Name</th>
                  <th className="px-6 py-4">Artist</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Purchase Date</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {loading ? (
                  <TableSkeleton />
                ) : purchaseData.length === 0 ? (
                  <tr>
                    <td className="px-6 py-10 text-center text-slate-500" colSpan={4}>
                      You have not purchased any artworks yet.
                    </td>
                  </tr>
                ) : (
                  purchaseData.map((item) => (
                    <tr key={item._id || item.artworkId} className="hover:bg-slate-50/50 transition-colors duration-150">
                      
                      {/* Artwork Column with Image */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 relative">
                            {item.artworkImage ? (
                              <Image src={item.artworkImage} alt={item.artworkTitle} fill className="object-cover" />
                            ) : (
                              <span className="text-lg">🎨</span>
                            )}
                          </div>
                          <span className="font-semibold text-slate-900">{item.artworkTitle || 'Untitled'}</span>
                        </div>
                      </td>

                      {/* Artist Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600 capitalize">
                          {item.artistName}
                        </span>
                      </td>

                      {/* Price Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      </td>

                      {/* Purchase Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {new Date(item.purchasedAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Upgrade Path</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {loading ? (
                  <TableSkeleton />
                ) : subscriptionData.length === 0 ? (
                  <tr>
                    <td className="px-6 py-10 text-center text-slate-500" colSpan={4}>
                      No subscription purchase history found.
                    </td>
                  </tr>
                ) : (
                  subscriptionData.map((item) => (
                    <tr key={item._id || item.transactionId} className="hover:bg-slate-50/50 transition-colors duration-150">
                      
                      {/* Transaction ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-950 font-bold">
                        {item.transactionId || 'N/A'}
                      </td>

                      {/* Upgrade Path */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="px-2 py-0.5 font-semibold rounded bg-slate-100 text-slate-600 capitalize">
                            {item.previousPlan || 'free'}
                          </span>
                          <span className="text-slate-400">🡒</span>
                          <span className={`px-2 py-0.5 font-bold rounded capitalize ${
                            item.newPlan === 'premium'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}>
                            {item.newPlan}
                          </span>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                        {getPlanPrice(item.newPlan)}
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {new Date(item.changedAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

    </div>
  );
};

export default UserDashboardPurchaseHistoryPage;