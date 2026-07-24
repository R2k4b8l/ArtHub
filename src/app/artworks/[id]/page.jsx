"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Edit3,
  Trash2,
  MessageSquare,
  AlertCircle,
  Calendar,
  X,
  Mail,
  Palette,
  Award,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  artworkCollection,
  getArtworkComments,
  addComment,
  updateArtwork,
  deleteArtwork,
} from "../../../lib/data";
import { DetailsSkeleton } from "@/Components/Skeleton";
import Image from "next/image";
import toast from "react-hot-toast";

const ArtWorkDetailsPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [artistStats, setArtistStats] = useState(null);
  const [loadingArtistStats, setLoadingArtistStats] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const handleOpenArtistModal = (e) => {
    e.preventDefault();
    if (!artwork?.artistId) {
      toast.error("Artist profile details not available");
      return;
    }
    setShowArtistModal(true);
  };

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const artworks = await artworkCollection();
        const found = artworks.find(
          (art) => art._id === id || encodeURIComponent(art.title) === id,
        );
        if (!isCancelled) {
          if (found) {
            setArtwork(found);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Failed to load artwork detail:", err);
        if (!isCancelled) {
          setError(true);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchArtwork();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!artwork?.artistId) return;

    const fetchArtistStats = async () => {
      try {
        setLoadingArtistStats(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/artist/${artwork.artistId}/stats`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setArtistStats(data.artist);
          }
        }
      } catch (err) {
        console.error("Failed to load artist details:", err);
      } finally {
        setLoadingArtistStats(false);
      }
    };

    fetchArtistStats();
  }, [artwork]);

  useEffect(() => {
    if (!id) return;

    const loadComments = async () => {
      try {
        const data = await getArtworkComments(id);
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadComments();
  }, [id]);

  if (loading || sessionLoading) {
    return <DetailsSkeleton />;
  }

  if (error || !artwork) {
    notFound();
  }

  const user = {
    isLoggedIn: !!session?.user,
    id: session?.user?.id || null,
    role: session?.user?.role || "user",
  };

  const isArtistOwner = user.isLoggedIn && user.id === artwork.artistId;
  const isArtist = user.role === "artist";
  const isSold = artwork?.isSold;
  const isAvailable = artwork?.status === "available";
  const isPurchaseDisabled = isArtistOwner || isArtist || isSold;

  const handleComment = async () => {
    if (!session?.user) {
      toast.error("Please login first");
      return;
    }

    if (session.user.role !== "user") {
      toast.error("Only users can comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setPostingComment(true);

      const res = await addComment({
        artworkId: artwork._id,
        userId: session.user.id,
        userName: session.user.name,
        userImage: session.user.image,
        comment,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to add comment");
      }

      setComments((prev) => [res.comment, ...prev]);

      setComment("");

      toast.success("Comment added successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPostingComment(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      title: artwork.title,
      description: artwork.description,
      price: artwork.price,
    });

    setShowEditModal(true);
  };

  const handleUpdateArtwork = async () => {
    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.price
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSaving(true);

      const res = await updateArtwork(artwork._id, {
        title: editForm.title,
        description: editForm.description,
        price: Number(editForm.price),
      });

      if (!res.success) {
        throw new Error("Failed to update artwork");
      }

      setArtwork((prev) => ({
        ...prev,
        title: editForm.title,
        description: editForm.description,
        price: Number(editForm.price),
      }));

      toast.success("Artwork updated successfully");

      setShowEditModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArtwork = async () => {
    try {
      setDeleting(true);

      const res = await deleteArtwork(artwork._id);

      if (!res.success) {
        throw new Error("Failed to delete artwork");
      }

      toast.success("Artwork deleted successfully");

      router.push("/artworks");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handlePurchase = async () => {
    try {
      if (!session?.user) {
        toast.error("Please login first");
        router.push(
          `/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }

      setPurchasing(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-checkout/artwork/${artwork._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerId: session.user.id,
            buyerName: session.user.name,
            buyerEmail: session.user.email,
            buyerImage: session.user.image || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Purchase failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe checkout URL is missing");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-violet-100 selection:text-violet-900">
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto py-12 md:py-20">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8">
          <Link
            href="/artworks"
            className="hover:text-slate-600 cursor-pointer"
          >
            Artworks
          </Link>
          <span>/</span>
          <span className="text-violet-600 font-semibold line-clamp-1">
            {artwork.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          <div className="lg:col-span-6 w-full">
            <div className="relative aspect-square w-full rounded-[32px] bg-white border border-slate-100 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group overflow-hidden">
              <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-slate-50 shadow-inner">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-750 ease-out group-hover:scale-[1.02]"
                  priority
                />

                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  {artwork.category && (
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                      {artwork.category}
                    </span>
                  )}

                  {artwork.status && (
                    <span
                      className={`text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-sm border ${
                        isAvailable
                          ? "bg-[#e2f9f0]/90 backdrop-blur-sm text-[#10b981] border-[#bbf7d0]/60"
                          : "bg-[#f1f5f9]/90 backdrop-blur-sm text-[#64748b] border-[#e2e8f0]/60"
                      }`}
                    >
                      {artwork.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 w-full flex flex-col justify-between h-full">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight leading-tight mb-4">
                {artwork.title}
              </h1>

              <div className="flex items-center bg-white px-4 py-3 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] max-w-fit mb-4 border border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shadow-md relative">
                    {artistStats?.image || artwork.artistImage ? (
                      <Image
                        src={artistStats?.image || artwork.artistImage}
                        alt={artwork.artistName || "Artist"}
                        fill
                        sizes="40px"
                        className="object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                        {(artwork.artistName || "U").charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                      Artist
                    </p>
                    <button
                      onClick={handleOpenArtistModal}
                      className="text-sm font-extrabold text-slate-800 hover:text-violet-600 transition-colors flex items-center gap-1.5 group border-0 bg-transparent p-0 cursor-pointer text-left outline-none"
                    >
                      <span>{artwork.artistName || "Unknown Artist"}</span>
                      <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        🔗
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-5 pl-1">
                <Calendar size={14} className="text-slate-400" />
                <span>
                  Uploaded:{" "}
                  <span className="text-slate-600">
                    {artwork.createdAt || "Recently"}
                  </span>
                </span>
              </div>

              <div className="bg-violet-50/30 border border-violet-100/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.03)] mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-violet-500 rounded-full"></span>
                  The Story Behind The Piece
                </h3>
                <p className="text-slate-600 text-[14px] md:text-[15px] leading-relaxed font-medium">
                  {artwork.description ||
                    "No description provided for this artwork."}
                </p>
              </div>
            </div>

            <div className="mt-auto">
              <div className="bg-white border border-slate-200/60 rounded-[28px] p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] mb-4">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Current Price
                  </p>
                  <span className="text-3xl font-black text-violet-600 tracking-tight">
                    ${artwork.price?.toLocaleString() || "0"}
                  </span>
                </div>

                {isSold ? (
                  <div className="space-y-3">
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed border border-slate-200/50"
                    >
                      <ShoppingCart size={18} />
                      <span>Already Sold</span>
                    </button>

                    <p className="text-center text-xs text-slate-500">
                      Purchased by {artwork.purchasedBy}
                    </p>
                  </div>
                ) : isArtistOwner || isArtist ? (
                  <div className="space-y-3">
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed border border-slate-200/50"
                    >
                      <ShoppingCart size={18} />
                      <span>Purchase Artwork</span>
                    </button>

                    <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-200/50 text-amber-700 px-3 py-2 rounded-lg text-xs font-semibold">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>
                        {isArtistOwner
                          ? "You are the owner of this artwork."
                          : "Artists are not allowed to purchase artworks."}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!session?.user) {
                        router.push(
                          `/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`,
                        );
                        return;
                      }

                      handlePurchase();
                    }}
                    disabled={purchasing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all duration-150 shadow-md shadow-purple-500/10 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} />
                    <span>
                      {purchasing ? "Processing..." : "Purchase Artwork"}
                    </span>
                  </button>
                )}
              </div>

              {isArtistOwner && (
                <div className="bg-violet-50/40 border border-violet-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-800">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                    <span>You own this artwork</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openEditModal}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-violet-600 transition shadow-sm cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition shadow-sm cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-200/60 max-w-3xl">
          <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-violet-600" />
            <span>Discussion & Reviews</span>
          </h2>

          {!user.isLoggedIn ? (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-center text-sm font-semibold text-slate-500 mb-6">
              🔒 Please login to leave a comment.
            </div>
          ) : user.role === "artist" ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center text-sm font-semibold text-amber-700 mb-6">
              Artists cannot comment on artworks.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-violet-100 flex items-center justify-center text-sm font-bold">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    session?.user?.name?.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="w-full">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this masterpiece..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-50 transition resize-none"
                  />

                  <button
                    onClick={handleComment}
                    disabled={postingComment}
                    className="mt-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {postingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-8 border rounded-2xl bg-white">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-200 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-violet-100 flex items-center justify-center font-bold">
                      {item.userImage ? (
                        <Image
                          src={item.userImage}
                          alt={item.userName}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        item.userName?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800">
                          {item.userName}
                        </h4>

                        <span className="text-xs text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                        {item.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-7 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Edit Artwork
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Title
                </label>

                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Description
                </label>

                <textarea
                  rows={5}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none resize-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Price
                </label>

                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      price: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateArtwork}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 p-7">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-600" size={30} />
            </div>

            <h2 className="text-2xl font-black text-center text-slate-900">
              Delete Artwork?
            </h2>

            <p className="text-center text-slate-500 mt-3 leading-relaxed">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteArtwork}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition cursor-pointer disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artist Profile Stats Modal */}
      <AnimatePresence>
        {showArtistModal && (
          <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200/60 p-6 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowArtistModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
              >
                <X size={18} />
              </button>

              {loadingArtistStats ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-9 h-9 border-3 border-violet-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Fetching Artist Info...
                  </p>
                </div>
              ) : artistStats ? (
                <div className="space-y-6">
                  {/* Artist Header Info */}
                  <div className="flex flex-col items-center text-center mt-3">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 p-1 shadow-sm mb-4">
                      {artistStats.image ? (
                        <Image
                          src={artistStats.image}
                          alt={artistStats.name}
                          fill
                          className="object-contain rounded-xl p-0.5"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-violet-500 to-indigo-500 text-white text-3xl font-black rounded-xl">
                          {artistStats.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {artistStats.name}
                    </h3>
                    
                    <span className="inline-flex items-center gap-1 mt-1.5 px-3 py-0.5 text-[10px] font-bold rounded-full bg-violet-100 text-violet-700 border border-violet-200/20 uppercase tracking-wider">
                      Verified Artist
                    </span>
                  </div>

                  {/* Details List */}
                  <div className="space-y-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl p-4.5">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail size={16} className="text-slate-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Email Address</p>
                        <p className="text-xs font-semibold text-slate-700 truncate">{artistStats.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar size={16} className="text-slate-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Joined Workspace</p>
                        <p className="text-xs font-semibold text-slate-700">
                          {artistStats.createdAt 
                            ? new Date(artistStats.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                            : "Creative Partner"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-xs">
                      <Palette className="w-5 h-5 text-violet-500 mx-auto mb-1.5" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Artworks</p>
                      <p className="text-xl font-extrabold text-slate-900">{artistStats.totalArtworks}</p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-xs">
                      <Award className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Works Sold</p>
                      <p className="text-xl font-extrabold text-slate-900">{artistStats.soldArtworks}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        sessionStorage.setItem("artistSearch", artistStats.name);
                        setShowArtistModal(false);
                        router.push("/artworks");
                      }}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all duration-150 shadow-md shadow-violet-500/10 active:scale-[0.99] cursor-pointer text-center"
                    >
                      <span>Explore Artist Gallery</span>
                      <span className="text-[10px]">➔</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 font-semibold text-sm">
                  Failed to load artist stats.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtWorkDetailsPage;