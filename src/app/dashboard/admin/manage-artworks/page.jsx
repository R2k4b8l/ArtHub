"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Palette,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import { artworkCollection, deleteArtwork } from "../../../../lib/data";
import Image from "next/image";

const AdminDashboardArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    averagePrice: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "" });

  // pagination stat
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 6;

  // Data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allArtworks = await artworkCollection();
        setArtworks(allArtworks);

        const totalArtworks = allArtworks.length;
        const availableArtworks = allArtworks.filter(
          (art) => art.status?.toLowerCase() === "available",
        ).length;

        const totalPrice = allArtworks.reduce((sum, art) => {
          const priceNum =
            typeof art.price === "string"
              ? parseFloat(art.price.replace(/[^0-9.-]+/g, ""))
              : art.price;
          return sum + (priceNum || 0);
        }, 0);
        const averagePrice =
          totalArtworks > 0 ? Math.round(totalPrice / totalArtworks) : 0;

        setStats({
          total: totalArtworks,
          available: availableArtworks,
          averagePrice: averagePrice,
        });
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // pagination calculate
  const filteredArtworks = artworks.filter((art) => {
    if (filterStatus === "all") return true;
    return art.status?.toLowerCase() === filterStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArtworks.length / itemsPerPage),
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtworks = filteredArtworks.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleDeleteClick = (artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedArtwork) return;

    try {
      const result = await deleteArtwork(selectedArtwork._id);
      if (!result.success) return;

      const updatedArtworks = artworks.filter(
        (art) => art._id !== selectedArtwork._id,
      );

      setArtworks(updatedArtworks);
      const newTotalPages = Math.ceil(
        updatedArtworks.filter((art) => {
          if (filterStatus === "all") return true;
          return art.status?.toLowerCase() === filterStatus;
        }).length / itemsPerPage,
      );

      const safePage =
        newTotalPages === 0 ? 1 : Math.min(currentPage, newTotalPages);
      setCurrentPage(safePage);

      const totalArtworks = updatedArtworks.length;
      const availableArtworks = updatedArtworks.filter(
        (art) => art.status?.toLowerCase() === "available",
      ).length;

      const parsePrice = (price) => {
        if (typeof price === "number") return price;
        if (!price) return 0;
        return parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0;
      };

      const totalPrice = updatedArtworks.reduce(
        (sum, art) => sum + parsePrice(art.price),
        0,
      );

      const averagePrice =
        totalArtworks > 0 ? Math.round(totalPrice / totalArtworks) : 0;

      setStats({
        total: totalArtworks,
        available: availableArtworks,
        averagePrice,
      });
      setToast({
        show: true,
        message: `"${selectedArtwork.title}" successfully deleted!`,
      });
      setTimeout(() => setToast({ show: false, message: "" }), 4000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalOpen(false);
      setSelectedArtwork(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans text-sm text-[#64748b]">
        Loading artworks dashboard...
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] p-4 sm:p-6 font-sans min-h-screen text-[#1e293b] relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl max-w-sm border border-slate-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => setToast({ show: false, message: "" })}
            className="ml-auto p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-lg sm:text-xl font-bold text-[#0f172a]">
          Manage All Artworks
        </h1>
        <p className="text-xs sm:text-sm text-[#64748b] mt-1">
          Manage, monitor and delete all artworks from one place.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Card 1: Total Artworks */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#64748b]">
                Total Artworks
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-[#0f172a]">
                {stats.total.toLocaleString()}
              </h2>
            </div>
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
              <Palette className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-indigo-600 font-medium mt-4 flex items-center gap-1">
            <span>+ 12% from last month</span>
          </p>
        </div>

        {/* Card 2: Available Artworks */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#64748b]">
                Available Artworks
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-[#0f172a]">
                {stats.available}
              </h2>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-4 flex items-center gap-1">
            <span>Healthy inventory levels</span>
          </p>
        </div>

        {/* Card 3: Average Price */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#64748b]">
                Average Price
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-[#0f172a]">
                ${stats.averagePrice.toLocaleString()}
              </h2>
            </div>
            <div className="bg-purple-50 text-purple-600 p-2 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-purple-600 font-medium mt-4 flex items-center gap-1">
            <span>High-tier market performance</span>
          </p>
        </div>
      </div>

      {/* UPDATED: Filter Section */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <div className="flex items-center gap-2 px-3 text-[#64748b]">
          <Filter className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Filter
          </span>
        </div>
        <div className="flex gap-1">
          {["all", "available", "sold"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200 ${
                filterStatus === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-[#64748b] hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full block">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold tracking-wider text-[#64748b] uppercase bg-slate-50/70">
                <th className="py-4 px-4 sm:px-6">Artwork</th>
                <th className="py-4 px-4 sm:px-6">Title</th>
                <th className="py-4 px-4 sm:px-6">Price</th>
                <th className="py-4 px-4 sm:px-6">Status</th>
                <th className="py-4 px-4 sm:px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentArtworks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">
                    No artworks found
                  </td>
                </tr>
              ) : (
                currentArtworks.map((artwork) => (
                  <tr
                    key={artwork._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        <Image
                          src={
                            artwork.image || "https://via.placeholder.com/48"
                          }
                          alt={artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="font-semibold text-[#0f172a]">
                        {artwork.title}
                      </div>
                      <div className="text-xs text-[#64748b] mt-0.5">
                        {artwork.category || artwork.type}
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-semibold text-indigo-600">
                      {typeof artwork.price === "number"
                        ? `$${artwork.price.toLocaleString()}`
                        : artwork.price}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          artwork.status?.toLowerCase() === "available"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            artwork.status?.toLowerCase() === "available"
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          }`}
                        ></span>
                        {artwork.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeleteClick(artwork)}
                        className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-xl transition-colors inline-flex items-center justify-center border border-rose-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls - Responsive Layout */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-xs text-[#64748b] order-2 sm:order-1">
              Showing Page{" "}
              <span className="font-medium text-[#1e293b]">{currentPage}</span>{" "}
              of{" "}
              <span className="font-medium text-[#1e293b]">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-[#475569] hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-[#1e293b] px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white text-[#475569] hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="bg-rose-50 p-2 rounded-xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                Delete Artwork
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#0f172a]">
                "{selectedArtwork?.title}"
              </span>
              ? This action cannot be undone and it will be permanently removed
              from the gallery dashboard.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedArtwork(null);
                }}
                className="px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#475569] hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors"
              >
                Delete Artwork
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardArtworks;
