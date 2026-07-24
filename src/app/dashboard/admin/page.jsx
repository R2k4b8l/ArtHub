"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, ShoppingBag, Palette, BarChart3 } from "lucide-react";
import {
  artworkCollection,
  getDailyTransactions,
  getTransactions,
} from "../../../lib/data";

import { DashboardSkeleton } from "../../../Components/Skeleton";

const CATEGORY_COLORS = [
  "#207CE5", // Blue
  "#E03131", // Red
  "#22B371", // Green
  "#F59F00", // Yellow/Orange
  "#845EF7", // Purple
  "#EE5A24", // Deep Orange
  "#ED17BD", // Magenta/Pink
  "#00C2CB", // Cyan/Teal
  "#BE4BDB", // Violet
  "#1098AD", // Ocean Blue
  "#FF922B", // Light Orange
  "#63E6BE", // Mint Green
  "#F783AC", // Hot Pink
  "#A9E34B", // Lime Green
  "#A34E31", // Brown/Terra Cotta
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// ─── Stat Card Component
const StatCard = ({ Icon, label, value, badge, badgeType }) => {
  const badgeStyles = {
    up: { background: "#eaf3de", color: "#3B6D11" },
    down: { background: "#FCEBEB", color: "#A32D2D" },
    stable: { background: "#f1f0f9", color: "#534AB7" },
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
      className="bg-white rounded-[14px] border border-black/5 p-4 flex flex-col gap-2 transition-all"
    >
      <div className="flex justify-between items-center">
        <div className="w-9 h-9 rounded-xl bg-[#eeedfe] flex items-center justify-center text-[#534AB7]">
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span
          style={badgeStyles[badgeType]}
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
        >
          {badge}
        </span>
      </div>
      <div>
        <div className="text-[12px] text-gray-400 mb-0.5">{label}</div>
        <div className="text-2xl font-semibold text-[#1a1a2e]">{value}</div>
      </div>
    </motion.div>
  );
};

// ─── Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, activeTab }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-black/10 rounded-xl p-2.5 text-[13px]">
        <div className="text-gray-400 mb-0.5">{label}</div>
        <div className="font-semibold text-[#534AB7]">
          {activeTab === "artwork"
            ? `$${payload[0].value.toLocaleString()} Artwork Sales`
            : `$${payload[0].value.toLocaleString()} Subscription Sales`}
        </div>
      </div>
    );
  }
  return null;
};

// ─── Main Admin Dashboard Component
const AdminDashboardPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [activeTab, setActiveTab] = useState("artwork");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworkData, dailyTx, allTransactions] = await Promise.all([
          artworkCollection(),
          getDailyTransactions(),
          getTransactions(),
        ]);

        setArtworks(artworkData || []);
        setDailyData(dailyTx || []);

        // Revenue calculation (purchase + subscription দুটো মিলিয়ে)
        const revenue = allTransactions.reduce((sum, tx) => {
          const amount = parseFloat(tx.amount.replace("$", "")) || 0;
          return sum + amount;
        }, 0);

        const orders = allTransactions.filter(
          (tx) => tx.type === "Purchase",
        ).length;

        setTotalRevenue(revenue);
        setTotalOrders(orders);
        setAvgOrderValue(orders > 0 ? revenue / orders : 0);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const categoryCounts = artworks.reduce((acc, art) => {
    const cat = art.category || "Others";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const totalArtworks = artworks.length;

  // Loading State with Dashboard Skeleton Effect
  if (loading) {
    return (
      <div className="bg-[#f5f4fc] min-h-screen p-4 sm:p-6 font-sans">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-[#f5f4fc] min-h-screen p-4 sm:p-6 font-sans">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-[#1a1a2e] m-0">Dashboard</h1>
        <p className="text-[13px] text-gray-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats Cards Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5"
      >
        <StatCard
          Icon={DollarSign}
          label="Total Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          badge="Live"
          badgeType="stable"
        />
        <StatCard
          Icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders.toLocaleString()}
          badge="Live"
          badgeType="stable"
        />
        <StatCard
          Icon={Palette}
          label="Total Artworks"
          value={totalArtworks}
          badge="Stable"
          badgeType="stable"
        />
        <StatCard
          Icon={BarChart3}
          label="Avg. Order Value"
          value={`$${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          badge="Live"
          badgeType="stable"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"
      >
        {/* Area Chart Component */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-[14px] border border-black/5 p-5 flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <div className="text-[15px] font-semibold text-[#1a1a2e]">
                Sales Overview
              </div>
              <div className="text-[12px] text-gray-400">
                Daily performance for June 2026c
              </div>
            </div>
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-full">
              {["artwork", "subscription"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[12px] px-4 py-1.5 rounded-full cursor-pointer transition-all capitalize font-medium ${
                    activeTab === tab
                      ? "bg-[#534AB7] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#534AB7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#534AB7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#aaa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#aaa" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                  }
                />
                <Tooltip content={<CustomTooltip activeTab={activeTab} />} />
                <Area
                  type="monotone"
                  dataKey={activeTab}
                  stroke="#534AB7"
                  strokeWidth={2}
                  fill="url(#colorFill)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#534AB7", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut / Pie Chart Component */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[14px] border border-black/5 p-5 flex flex-col justify-between"
        >
          <div>
            <div className="text-[15px] font-semibold text-[#1a1a2e]">
              Artworks by Category
            </div>
            <div className="text-[12px] text-gray-400 mb-3">
              Inventory distribution
            </div>
          </div>

          <div className="relative w-full flex justify-center py-2">
            {categoryData.length > 0 ? (
              <>
                <PieChart width={180} height={180}>
                  <Pie
                    data={categoryData}
                    cx={85}
                    cy={85}
                    innerRadius={58}
                    outerRadius={82}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-xl font-semibold text-[#1a1a2e]">
                    {totalArtworks >= 1000
                      ? `${(totalArtworks / 1000).toFixed(1)}k`
                      : totalArtworks}
                  </div>
                  <div className="text-[9px] text-gray-400 tracking-wider">
                    TOTAL ITEMS
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[180px] flex items-center text-[13px] text-gray-400">
                No data available
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                  }}
                />
                <span className="text-[11px] text-gray-600 truncate">
                  {cat.name} ({cat.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
