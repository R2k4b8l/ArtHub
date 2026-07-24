"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const DashboardRedirectPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/sign-in");
      } else {
        const role = session.user?.role;

        if (role === "admin") {
          router.replace("/dashboard/admin");
        } else if (role === "artist") {
          router.replace("/dashboard/artist");
        } else if (role === "user") {
          router.replace("/dashboard/user");
        } else {
          router.replace("/unauthorized");
        }
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 animate-pulse">
      
      {/* Welcome Banner Skeleton */}
      <div className="bg-[#eef3ff] rounded-[24px] p-8 flex justify-between items-center h-[260px]">

        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded w-56" />
          <div className="h-4 bg-slate-200 rounded w-96" />
          <div className="h-4 bg-slate-200 rounded w-72" />

          <div className="h-12 bg-slate-200 rounded-full w-40 mt-6" />
        </div>

        <div className="w-52 h-52 rounded-[24px] bg-slate-200" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-8"
          >
            <div className="flex justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-200" />
              <div className="h-5 w-20 rounded-full bg-slate-200" />
            </div>

            <div className="space-y-3">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="h-8 w-20 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DashboardRedirectPage;