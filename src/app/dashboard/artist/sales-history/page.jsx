"use client";
import React, { useState, useEffect } from "react";
import { purchaseHistory } from "@/lib/data";
import { useSession } from "@/lib/auth-client";
import { getInitials, isRemote } from "@/lib/avatar";
import Image from "next/image";

// Mock data list (9 items total)

const SalesHistoryPage = () => {
  const { data: session } = useSession();

  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 8;

  useEffect(() => {
    const loadSales = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);

        const data = await purchaseHistory(undefined, session.user.id);

        setSalesData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSales();
  }, [session]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salesData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(salesData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 px-4 sm:px-6 md:py-12 md:px-12 font-sans text-[#1E293B]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] mb-1 md:mb-2">
            Sales History
          </h1>
          <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed max-w-2xl">
            Track your artistic journey. Review all transactions, manage
            payouts, and analyze your marketplace performance in real-time.
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* 1. TABLE VIEW (Medium & Large Devices) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold tracking-wider text-[#64748B] uppercase bg-white">
                  <th className="py-4 px-6 w-[35%]">Artwork</th>
                  <th className="py-4 px-6 w-[20%]">Buyer</th>
                  <th className="py-4 px-6 w-[18%]">Purchase Date</th>
                  <th className="py-4 px-6 w-[15%]">Amount</th>
                  <th className="py-4 px-6 w-[12%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {isLoading
                  ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-slate-200 rounded"></div>
                              <div className="h-3 w-20 bg-slate-200 rounded"></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-slate-200"></div>
                            <div className="h-4 w-24 bg-slate-200 rounded"></div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 w-20 bg-slate-200 rounded"></div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-4 w-16 bg-slate-200 rounded"></div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                        </td>
                      </tr>
                    ))
                  : currentItems.map((row) => (
                      <tr
                        key={row._id}
                        className="hover:bg-[#F8FAFC] transition-colors duration-150"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                              <Image
                                src={row.artworkImage}
                                alt={row.artworkTitle}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div>
                              <h4 className="font-bold text-[#0F172A] text-[15px]">
                                {row.artworkTitle}
                              </h4>

                              <p className="text-xs text-[#64748B] mt-0.5">
                                {row.artistName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-purple-500 shadow-sm shrink-0 flex items-center justify-center">
                              {isRemote(row.buyerImage) ? (
                                <Image
                                  src={row.buyerImage}
                                  alt={row.buyerName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white text-[10px] font-extrabold tracking-wider shadow-inner select-none">
                                  {getInitials(row.buyerName)}
                                </div>
                              )}
                            </div>

                            <span className="text-[#334155] text-sm font-medium">
                              {row.buyerName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-[#475569]">
                          {new Date(row.purchasedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-[15px] font-bold text-[#4338CA]">
                          ${row.price}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#6366F1] bg-[#EEF2FF] rounded-full border border-[#E0E7FF]">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* 2. CARD/LIST VIEW (Optimized for Small/Mobile Devices) */}
          <div className="block md:hidden divide-y divide-[#F1F5F9]">
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="p-4 space-y-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-slate-200"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-200 rounded"></div>
                          <div className="h-3 w-20 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                        <div className="h-3 w-24 bg-slate-200 rounded"></div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="h-3 w-16 bg-slate-200 rounded ml-auto"></div>
                        <div className="h-4 w-12 bg-slate-200 rounded ml-auto"></div>
                      </div>
                    </div>
                  </div>
                ))
              : currentItems.map((row) => (
                  <div
                    key={row._id}
                    className="p-4 space-y-3.5 bg-white hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Top Row: Image, Title and Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={row.artworkImage}
                            alt={row.artworkTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#0F172A] text-[14px] truncate">
                            {row.artworkTitle}
                          </h4>
                          <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                            {row.artistName}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold text-[#6366F1] bg-[#EEF2FF] rounded-full border border-[#E0E7FF] shrink-0">
                        Complete
                      </span>
                    </div>

                    {/* Bottom Row: Buyer Info and Price/Date */}
                    <div className="flex items-center justify-between text-xs pt-2.5 border-t border-dashed border-[#E2E8F0]">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-purple-500 shadow-sm shrink-0 flex items-center justify-center">
                          {isRemote(row.buyerImage) ? (
                            <Image
                              src={row.buyerImage}
                              alt={row.buyerName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white text-[8px] font-extrabold tracking-wider shadow-inner select-none">
                              {getInitials(row.buyerName)}
                            </div>
                          )}
                        </div>

                        <span className="text-[#475569] font-medium truncate">
                          {row.buyerName}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[#64748B] block text-[10px] font-medium">
                          {new Date(row.purchasedAt).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-[#4338CA] text-[14px]">
                          ${row.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Pagination Footer */}
          <div className="py-4 px-4 sm:px-6 border-t border-[#F1F5F9] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-medium text-[#64748B] order-2 sm:order-1 text-center sm:text-left">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, salesData.length)} of{" "}
              {salesData.length} transactions
            </span>

            <div className="flex items-center gap-1.5 order-1 sm:order-2 justify-center w-full sm:w-auto">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold text-xs transition-all ${
                      currentPage === pageNum
                        ? "bg-[#5046e5] text-white shadow-sm"
                        : "text-[#64748B] hover:bg-slate-50 font-medium"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition-colors ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesHistoryPage;
