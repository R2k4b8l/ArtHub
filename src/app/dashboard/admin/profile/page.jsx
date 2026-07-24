"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getInitials, isRemote } from "@/lib/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileSkeleton } from "@/Components/Skeleton";
import {
  Camera,
  Pencil,
  Lock,
  Users,
  Palette,
  Calendar,
  ShieldCheck,
  X,
  DollarSign,
  Activity,
} from "lucide-react";
import {
  useSession,
  updateUser,
  changePassword,
  changeEmail,
} from "@/lib/auth-client";
import { toast } from "react-hot-toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const AdminProfilePage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
    role: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [tempProfile, setTempProfile] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [tempPreviewImage, setTempPreviewImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalArtworks: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      role: user.role || "admin",
    });
    setPreviewImage(user.image || "");
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const loadPlatformStats = async () => {
      try {
        const [usersRes, artworksRes, purchasesRes, subscriptionsRes] =
          await Promise.all([
            fetch(`${backendUrl}/user`),
            fetch(`${backendUrl}/artworks`),
            fetch(`${backendUrl}/purchasehistory`),
            fetch(`${backendUrl}/transactions`),
          ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const artworks = artworksRes.ok ? await artworksRes.json() : [];
        const purchases = purchasesRes.ok ? await purchasesRes.json() : [];
        const transactions = subscriptionsRes.ok
          ? await subscriptionsRes.json()
          : [];

        const totalUsers = Array.isArray(users)
          ? users.filter((u) => u.role === "user").length
          : 0;
        const totalArtists = Array.isArray(users)
          ? users.filter((u) => u.role === "artist").length
          : 0;
        const totalArtworks = Array.isArray(artworks) ? artworks.length : 0;

        const purchaseRevenue = Array.isArray(purchases)
          ? purchases.reduce((sum, o) => sum + (Number(o.price) || 0), 0)
          : 0;

        const subscriptionRevenue = Array.isArray(transactions)
          ? transactions
              .filter((t) => t.type === "Subscription")
              .reduce((sum, t) => {
                const amount = parseFloat(
                  String(t.amount || "0").replace("$", "")
                );
                return sum + (isNaN(amount) ? 0 : amount);
              }, 0)
          : 0;

        const totalRevenue = (purchaseRevenue + subscriptionRevenue).toFixed(2);

        setStats({ totalUsers, totalArtists, totalArtworks, totalRevenue });
      } catch (error) {
        console.error("Error loading platform stats:", error);
      }
    };

    loadPlatformStats();
  }, [user?.id]);

  const isLoading = isPending || !user;

  const handleOpenEdit = () => {
    setTempProfile({
      name: profile.name,
      email: profile.email,
      image: profile.image,
    });
    setTempPreviewImage(previewImage);
    setEditOpen(true);
  };

  const handleProfileField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleTempProfileField = (field, value) => {
    setTempProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordField = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImageToImgbb = async (file) => {
    if (!imgbbKey) {
      toast.error("IMGBB API key is missing.");
      return null;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error?.message || "Upload failed");
      }

      return result.data.url;
    } catch (error) {
      console.error("ImgBB upload error:", error);
      toast.error("Avatar upload failed.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const tmpUrl = URL.createObjectURL(file);
    setTempPreviewImage(tmpUrl);

    const imageUrl = await uploadImageToImgbb(file);
    if (imageUrl) {
      setTempProfile((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Avatar uploaded successfully.");
    }
  };

  const saveProfile = async () => {
    if (!tempProfile.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSavingProfile(true);
    try {
      await updateUser({
        name: tempProfile.name,
        image: tempProfile.image || undefined,
      });

      if (tempProfile.email && tempProfile.email !== profile.email) {
        await changeEmail({ newEmail: tempProfile.email });
      }

      const response = await fetch(`${backendUrl}/user/${user.id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tempProfile.name,
          email: tempProfile.email,
          image: tempProfile.image,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update backend profile");
      }

      setProfile((prev) => ({
        ...prev,
        name: tempProfile.name,
        email: tempProfile.email,
        image: tempProfile.image,
      }));
      setPreviewImage(tempPreviewImage);

      toast.success("Profile updated successfully.");
      setEditOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Profile save failed:", error);
      toast.error(error.message || "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePasswordSubmit = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Complete all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordOpen(false);
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error(error.message || "Could not change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FC] p-6 lg:p-10 font-sans text-slate-800">
        <div className="mb-8 max-w-[1440px] mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] animate-pulse">
              Admin Control Panel
            </h1>
          </div>
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9FC] p-4 sm:p-6 lg:p-10 font-sans text-slate-800">
      {/* Top Profile Header Section */}
      <div className="mb-6 sm:mb-8 max-w-[1440px] mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Admin Control Panel
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your administrator identity, platform analytics, and account
            security.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="w-full sm:w-auto text-center inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
        >
          Back to dashboard
        </Link>
      </div>

      {/* Main Profile Box */}
      <div className="w-full max-w-[1440px] mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {/* Identity Info Column */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start">
            <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-6 flex-shrink-0 w-full sm:w-auto">
              <div className="relative group cursor-pointer mx-auto sm:mx-0">
                <div className="w-32 h-32 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center p-2 relative">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt={profile.name}
                      width={128}
                      height={128}
                      priority
                      unoptimized={isRemote(previewImage)}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white text-3xl font-extrabold tracking-wider select-none rounded-xl">
                      {getInitials(profile.name)}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleOpenEdit}
                  className="absolute -bottom-1 -right-1 bg-white text-slate-700 hover:text-slate-900 p-2 rounded-full border border-slate-200 shadow-md transition-all duration-200 hover:scale-105"
                  title="Update Profile Picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5 w-full sm:w-40">
                <button
                  onClick={handleOpenEdit}
                  className="inline-flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 w-full"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setPasswordOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-[#DCE4EC] hover:bg-[#D1DCE8] text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 w-full"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4 text-center sm:text-left w-full h-full flex flex-col justify-start pt-2 items-center sm:items-start">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {profile.name}
                </h2>
                <span className="inline-flex items-center justify-center gap-1 px-3 py-0.5 text-[11px] font-semibold rounded-full bg-[#F3E8FF] text-[#7C3AED] border border-[#E9D5FF]/40 capitalize w-fit">
                  <ShieldCheck className="w-3 h-3" />
                  Administrator
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-500">
                  {profile.email}
                </p>
                {!user.emailVerified && (
                  <p className="text-[10px] text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5 inline-block">
                    Pending Verification
                  </p>
                )}
              </div>

              <div className="space-y-1 w-full">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Bio / Note
                </h4>
                <p className="text-slate-600 text-xs md:text-sm font-normal leading-relaxed max-w-lg mx-auto sm:mx-0">
                  Platform administrator overseeing ArtHub operations,
                  marketplace integrity, and user management.
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400 font-medium pt-4 mt-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>Access Level: Full Platform Control</span>
              </div>
            </div>
          </div>

          {/* Platform Analytics Side Pane */}
          <div className="w-full bg-[#F8F9FC]/80 border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center sm:text-left">
                Platform Analytics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                {/* Total Users */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 rounded-xl text-[#7C3AED]">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">
                      Total Users
                    </p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {stats.totalUsers}
                  </p>
                </div>

                {/* Total Artists */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-50 rounded-xl text-pink-600">
                      <Palette className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">
                      Total Artists
                    </p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {stats.totalArtists}
                  </p>
                </div>

                {/* Total Artworks */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                      <Activity className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">
                      Total Artworks
                    </p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {stats.totalArtworks}
                  </p>
                </div>

                {/* Platform Revenue */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">
                      Platform Revenue
                    </p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    ${stats.totalRevenue}
                  </p>
                </div>
              </div>
            </div>

            {/* General Tip Badge */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#7C3AED] mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-500 leading-normal">
                You have full administrative access. Please use account controls
                responsibly to maintain platform security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT IDENTITY MODAL */}
      <AnimatePresence>
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Edit profile
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Change your display name, email address or avatar picture.
                  </p>
                </div>
                <button
                  onClick={() => setEditOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) =>
                        handleTempProfileField("name", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) =>
                        handleTempProfileField("email", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Profile picture source
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white border border-slate-200 p-1 mx-auto sm:mx-0">
                      {tempPreviewImage ? (
                        <Image
                          src={tempPreviewImage}
                          alt="preview"
                          fill
                          className="object-contain rounded-xl p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs w-full sm:w-auto">
                      <Camera className="h-4 w-4 text-slate-500" />
                      <span>
                        {uploadingImage ? "Uploading…" : "Upload custom file"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarSelect}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
                  <button
                    onClick={() => setEditOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={savingProfile || uploadingImage}
                    className="rounded-xl bg-[#7C3AED] px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-600 disabled:opacity-70 transition-colors shadow-sm w-full sm:w-auto"
                  >
                    {savingProfile ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PASSWORD UPDATE MODAL */}
      <AnimatePresence>
        {passwordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Change password
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Provide authentication parameters securely below.
                  </p>
                </div>
                <button
                  onClick={() => setPasswordOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      handlePasswordField("currentPassword", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:bg-white text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    New password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      handlePasswordField("newPassword", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:bg-white text-slate-800"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      handlePasswordField("confirmPassword", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#7C3AED] focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setPasswordOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={changePasswordSubmit}
                  disabled={savingPassword}
                  className="rounded-xl bg-[#7C3AED] px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-600 disabled:opacity-70 transition-colors shadow-sm w-full sm:w-auto"
                >
                  {savingPassword ? "Updating…" : "Update password"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfilePage;
