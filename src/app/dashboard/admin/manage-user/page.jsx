"use client";

import React, { useState, useEffect } from "react";
import { userDetails, updateUserRole } from "../../../../lib/data";
import { TableSkeleton } from "../../../../Components/Skeleton";
import Image from "next/image";

export function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isRemote(url) {
  return typeof url === "string" && url.startsWith("http");
}

// ---------------- COMPONENT ----------------
const AdminDashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  // ---------- FETCH USERS ----------
  useEffect(() => {
    const fetchData = async () => {
      const data = await userDetails();
      setUsers(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ---------- COUNTS ----------
  const totalUsersCount = users.filter((u) => u.role === "user").length;
  const totalArtistsCount = users.filter((u) => u.role === "artist").length;
  const totalAdminsCount = users.filter((u) => u.role === "admin").length;

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // ---------- MODAL ----------
  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || "user");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  // ---------- ROLE UPDATE ----------
  const handleRoleUpdate = async () => {
    if (!selectedUser?._id) return;

    if (selectedUser.role === selectedRole) {
      closeModal();
      return;
    }

    try {
      const result = await updateUserRole(selectedUser._id, selectedRole);

      if (result?.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id
              ? { ...user, role: selectedRole }
              : user,
          ),
        );
        closeModal();
      } else {
        console.log("Update failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Manage Users
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Overview and management of all registered platform users.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-2">
          <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total User
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-[#155DFC]">
            {loading ? (
              <div className="h-8 bg-slate-200 rounded w-12 animate-pulse" />
            ) : (
              totalUsersCount
            )}
          </span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-2">
          <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Artist
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-purple-600">
            {loading ? (
              <div className="h-8 bg-slate-200 rounded w-12 animate-pulse" />
            ) : (
              totalArtistsCount
            )}
          </span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-2 sm:col-span-2 lg:col-span-1">
          <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total Admin
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
            {loading ? (
              <div className="h-8 bg-slate-200 rounded w-12 animate-pulse" />
            ) : (
              totalAdminsCount
            )}
          </span>
        </div>
      </div>

      {/* TABLE WORKFLOW LAYER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[650px] sm:min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold tracking-wide">
                <th className="p-4 w-16 sm:w-20">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 w-24 sm:w-32">Role</th>
                <th className="p-4 text-center w-28 sm:w-36">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-600">
              {loading ? (
                /* CONDITIONAL TABLE SKELETON LOADED HERE */
                <TableSkeleton rows={5} />
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <td className="p-4 whitespace-nowrap">
                      {isRemote(user.image) ? (
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-inner">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="p-4 whitespace-nowrap font-medium text-gray-900">
                      {user.name || "N/A"}
                    </td>

                    {/* Email */}
                    <td className="p-4 whitespace-nowrap">
                      {user.email || "N/A"}
                    </td>

                    {/* Badge Role */}
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-emerald-50 text-emerald-700"
                            : user.role === "artist"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-blue-50 text-[#155DFC]"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>

                    {/* Trigger Button */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => openModal(user)}
                        className="bg-blue-50 text-[#155DFC] hover:bg-blue-100 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 border border-blue-100 shadow-sm"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 bg-white">
            <p className="text-sm text-gray-500">
              Showing Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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

              <span className="text-sm font-medium text-gray-900">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
        )}
      </div>

      {/* ADAPTIVE MODAL */}
      {isOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md shadow-2xl border border-gray-100 transform transition-all scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                Modify User Role
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm sm:text-base p-1.5 transition-colors rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {isRemote(selectedUser.image) ? (
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      src={selectedUser.image}
                      alt={selectedUser.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 truncate text-xs sm:text-sm md:text-base">
                    {selectedUser.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Selector Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Select New Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] cursor-pointer shadow-sm transition-all"
                >
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Footer Control Actions */}
            <div className="mt-6 flex items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#7C3AED] hover:bg-[#6d28d9] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-purple-100 transition-all duration-150 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardUsers;
