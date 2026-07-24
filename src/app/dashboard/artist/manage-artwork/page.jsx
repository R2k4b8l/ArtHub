"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Pencil, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { TableSkeleton } from '@/Components/Skeleton';
import Image from 'next/image';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ArtistArtworkManage = () => {
  const { data: session, isPending } = useSession();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [deleteArtwork, setDeleteArtwork] = useState(null);
  const [formState, setFormState] = useState({ title: '', category: '', description: '', price: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ITEMS_PER_PAGE = 7;
const [currentPage, setCurrentPage] = useState(1);

  const fetchArtworks = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/artworks?artistId=${encodeURIComponent(session.user.id)}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to load artworks');
        return;
      }

      setArtworks(Array.isArray(data) ? data : []);

      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load your artworks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchArtworks();
    }
  }, [session?.user?.id]);

  const stats = useMemo(() => {
    const total = artworks.length;
    const sold = artworks.filter((art) => art.isSold || art.status?.toLowerCase() === 'sold').length;
    const available = total - sold;
    return { total, sold, available };
  }, [artworks]);

  const totalPages = Math.ceil(artworks.length / ITEMS_PER_PAGE);

const paginatedArtworks = useMemo(() => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  return artworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
}, [artworks, currentPage]);

  const openEditModal = (artwork) => {
    setSelectedArtwork(artwork);
    setFormState({
      title: artwork.title || '',
      category: artwork.category || '',
      description: artwork.description || '',
      price: artwork.price?.toString() || ''
    });
  };

  const closeEditModal = () => {
    setSelectedArtwork(null);
    setFormState({ title: '', category: '', description: '', price: '' });
  };

  const openDeleteModal = (artwork) => {
    setDeleteArtwork(artwork);
  };

  const closeDeleteModal = () => {
    setDeleteArtwork(null);
  };

  const handleFormChange = (key, value) => {
    if (key === 'price') {
      const regex = /^[0-9]*\.?[0-9]{0,2}$/;
      if (value !== '' && !regex.test(value)) return;
    }
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selectedArtwork) return;
    if (!formState.title.trim() || !formState.category.trim() || !formState.price.trim()) {
      toast.error('Title, category, and price are required.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${backendUrl}/artworks/${selectedArtwork._id || selectedArtwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formState.title,
          category: formState.category,
          description: formState.description,
          price: parseFloat(formState.price)
        })
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to update artwork');
        return;
      }

      setArtworks((prev) =>
        prev.map((item) =>
          item._id === selectedArtwork._id || item.id === selectedArtwork.id
            ? { ...item, ...formState, price: parseFloat(formState.price) }
            : item
        )
      );

      toast.success('Artwork updated successfully');
      closeEditModal();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating artwork.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteArtwork) return;
    setDeleting(true);

    try {
      const res = await fetch(`${backendUrl}/artworks/${deleteArtwork._id || deleteArtwork.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to delete artwork');
        return;
      }

      const deleteId = deleteArtwork._id || deleteArtwork.id;

const updatedArtworks = artworks.filter(
  (item) => (item._id || item.id) !== deleteId
);

setArtworks(updatedArtworks);


const newTotalPages = Math.ceil(updatedArtworks.length / ITEMS_PER_PAGE);

if (currentPage > newTotalPages && newTotalPages > 0) {
  setCurrentPage(newTotalPages);
}
      toast.success('Artwork removed successfully');
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting artwork.');
    } finally {
      setDeleting(false);
    }
  };

  if (isPending) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FC] p-6 lg:p-10 font-sans text-slate-800 animate-pulse">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="h-4 bg-slate-200 rounded w-96" />
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="h-6 bg-slate-200 rounded w-48" />
          <div className="space-y-3 pt-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                  <div className="h-4 bg-slate-200 rounded w-32" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-20" />
                <div className="h-4 bg-slate-200 rounded w-12" />
                <div className="h-4 bg-slate-200 rounded w-16" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                  <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9FC] p-6 lg:p-10 font-sans text-slate-800">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Manage Your Masterpieces</h1>
        <p className="text-slate-500 text-sm mt-1">Track, edit, and curate the artwork you have added.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Artworks</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900">{stats.available}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sold</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900">{stats.sold}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Artwork</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading ? (
                <TableSkeleton rows={4} />
              ) : artworks.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-center text-slate-500" colSpan={5}>
                    You have not added any artworks yet.
                  </td>
                </tr>
              ) : (
                paginatedArtworks.map((artwork) => {
                  const isItemSold = artwork.isSold || artwork.status?.toLowerCase() === 'sold';
                  const statusText = isItemSold ? 'Sold' : artwork.status || 'Available';

                  return (
                    <tr key={artwork._id || artwork.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm relative">
                            {artwork.image ? (
                              <Image src={artwork.image} alt={artwork.title} fill className="object-cover" />
                            ) : (
                              <span className="text-lg">🎨</span>
                            )}
                          </div>
                          <span className="font-semibold text-slate-900">{artwork.title || 'Untitled'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600 capitalize">
                          {artwork.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                        ${typeof artwork.price === 'number' ? artwork.price.toFixed(2) : artwork.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${isItemSold ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'} capitalize`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => openEditModal(artwork)}
                            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit Masterpiece"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(artwork)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
  <p className="text-sm text-slate-500">
    Showing{" "}
    <span className="font-semibold">
      {artworks.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
    </span>{" "}
    -{" "}
    <span className="font-semibold">
      {Math.min(currentPage * ITEMS_PER_PAGE, artworks.length)}
    </span>{" "}
    of <span className="font-semibold">{artworks.length}</span> artworks
  </p>

  <div className="flex items-center gap-2">
    <button
      onClick={() => setCurrentPage((prev) => prev - 1)}
      disabled={currentPage === 1}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
          currentPage === index + 1
            ? "bg-violet-600 text-white"
            : "border border-slate-200 bg-white hover:bg-slate-50"
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((prev) => prev + 1)}
      disabled={currentPage === totalPages || totalPages === 0}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>
      </div>

      <AnimatePresence>
        {selectedArtwork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Edit Artwork</h2>
                  <p className="text-sm text-slate-500">Update title, description, category, or price.</p>
                </div>
                <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Title</span>
                  <input
                    value={formState.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Category</span>
                  <input
                    value={formState.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
                  />
                </label>
              </div>

              <div className="space-y-2 mt-5 text-sm text-slate-700">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={formState.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
                />
              </div>

              <div className="w-full max-w-xs mt-5 text-sm text-slate-700">
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Price (USD)</span>
                  <input
                    value={formState.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-2xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {deleteArtwork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Delete artwork?</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteArtwork.title}</span>? This action will remove it permanently.
                  </p>
                </div>
                <button onClick={closeDeleteModal} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtistArtworkManage;
