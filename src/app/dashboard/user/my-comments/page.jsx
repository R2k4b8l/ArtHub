"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiExternalLink, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getUserComments } from "@/lib/data";

const UserDashboardCommentPage = () => {
  const { data: session } = useSession();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      if (!session?.user?.id) return;

      try {
        const data = await getUserComments(session.user.id);

        setComments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [session]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentComments = comments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(comments.length / itemsPerPage);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">My Comments</h1>
        <p className="text-gray-600">
          Manage your interactions and feedback across the marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            Loading...
          </div>
        ) : currentComments.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            You haven't posted any comments yet.
          </div>
        ) : (
          currentComments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-8 items-start"
            >
              <div className="shrink-0">
                <Image
                  src={comment.artworkImage}
                  alt={comment.artworkTitle}
                  width={80}
                  height={80}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                  className="rounded-lg"
                />
              </div>

              <div className="flex flex-col w-full">
                <h2 className="text-lg font-bold text-gray-900">
                  {comment.artworkTitle}
                </h2>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Posted on {new Date(comment.createdAt).toLocaleDateString()}
                </p>

                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {comment.comment}
                </p>

                <Link
                  href={`/artworks/${comment.artworkId}`}
                  className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline w-fit"
                >
                  View Artwork <FiExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* প্যাজিনেশন */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-3 bg-white rounded-full shadow border hover:bg-gray-50 disabled:opacity-50 transition-all"
          >
            <FiChevronLeft size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-3 bg-white rounded-full shadow border hover:bg-gray-50 disabled:opacity-50 transition-all"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboardCommentPage;
