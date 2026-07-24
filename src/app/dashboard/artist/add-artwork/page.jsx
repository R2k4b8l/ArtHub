"use client";

import React, { useState } from "react";
import { Plus, List, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FormSkeleton } from "@/Components/Skeleton";
import Image from "next/image";

const AddArtworkPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [isCustom, setIsCustom] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const finalCategory = isCustom ? customCategory : category;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
      setImageFile(file);
      toast.success("Image selected successfully!");
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]{0,2}$/;
    if (regex.test(value)) {
      setPrice(value);
    }
  };

  const handleBlur = () => {
    const val = parseFloat(price);
    if (!isNaN(val)) {
      setPrice(val.toFixed(2));
    } else {
      setPrice("");
    }
  };

  const handleListArtwork = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an artwork image first");
      return;
    }
    if (!finalCategory) {
      toast.error("Please select or enter a category");
      return;
    }
    if (!price) {
      toast.error("Please set a price");
      return;
    }

    setSubmitting(true);
    let uploadedUrl = "";

    try {
      // Upload to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );
      const imgData = await response.json();
      if (imgData.success) {
        uploadedUrl = imgData.data.url;
      } else {
        toast.error("Image upload to ImgBB failed.");
        setSubmitting(false);
        return;
      }

      // Post to backend
      const payload = {
        title,
        category: finalCategory,
        description,
        price: parseFloat(price),
        image: uploadedUrl,
        artistName: session?.user?.name,
        artistEmail: session?.user?.email,
        artistId: session?.user?.id,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/artworks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Artwork listed successfully!");
        router.push("/artworks");
      } else {
        toast.error(data.error || "Failed to list artwork");
      }
    } catch (error) {
      console.error("Error listing artwork:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg p-3 outline-none transition focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] bg-white text-gray-900";

  if (isPending) {
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-slate-200 rounded w-64 animate-pulse" />
          </div>
          <FormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Add New Masterpiece
          </h1>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
          <form className="space-y-8" onSubmit={handleListArtwork}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="font-medium text-gray-700">Artist Name</label>
                <input
                  type="text"
                  value={session?.user?.name || ""}
                  disabled
                  className="w-full bg-gray-100 text-gray-900 border border-gray-200 rounded-lg p-3 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full bg-gray-100 text-gray-900 border border-gray-200 rounded-lg p-3 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Artwork Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Whispers of the Horizon"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-gray-700">Category</label>

                {isCustom ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type custom category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className={inputClass}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setIsCustom(false);
                        setCustomCategory("");
                      }}
                      className="px-3 text-red-500 font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <select
                    className={inputClass}
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === "other") {
                        setIsCustom(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Painting">Painting</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Sculpture">Sculpture</option>
                    <option value="Nature">Nature</option>
                    <option value="Horizon">Horizon</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Photography">Photography</option>
                    <option value="Fantasy">Fantasy</option>

                    <option value="other">+ Add Custom Category</option>
                  </select>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Tell the story behind your masterpiece..."
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  List Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    required
                    value={price}
                    onChange={handlePriceChange}
                    onBlur={handleBlur}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Upload Artwork
                </label>
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer block hover:border-[#7C3AED] hover:bg-purple-50 transition duration-150">
                  {submitting ? (
                    <div className="flex justify-center items-center gap-2 text-[#7C3AED]">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7C3AED]"></div>
                      Listing Artwork...
                    </div>
                  ) : imagePreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                      <div className="relative w-24 h-16 rounded overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Uploaded Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium max-w-[200px] truncate">
                        {imageName}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-purple-100 text-[#7C3AED] p-3 rounded-full">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-gray-900">
                        Click to select image
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-8 mt-12">
              <button
                type="submit"
                disabled={!imageFile || submitting}
                className={`px-8 py-3 rounded-lg flex items-center gap-2.5 transition font-medium text-white ${
                  imageFile && !submitting
                    ? "bg-[#7C3AED] hover:bg-[#6D28D9] shadow-sm cursor-pointer"
                    : "bg-[#7C3AED] opacity-50 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <List size={20} />
                )}
                <span>{submitting ? "Listing..." : "List Artwork"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddArtworkPage;
