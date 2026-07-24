import React from "react";

export const CardSkeleton = () => (
  <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 p-2 animate-pulse shadow-sm w-full">
    <div className="aspect-square w-full rounded-[18px] bg-slate-200" />
    <div className="p-3.5 pt-4 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 4 }) => (
  <>
    {[...Array(rows)].map((_, idx) => (
      <tr key={idx} className="animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0" />
            <div className="h-4 bg-slate-200 rounded w-32" />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-5 bg-slate-200 rounded-full bg-slate-200 w-20" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-slate-200 rounded w-12" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-5 bg-slate-200 rounded-full bg-slate-200 w-16" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          <div className="flex justify-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
          </div>
        </td>
      </tr>
    ))}
  </>
);

export const FormSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-12 bg-slate-100 rounded-lg w-full" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded w-24" />
      <div className="h-32 bg-slate-100 rounded-2xl w-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="h-12 bg-slate-100 rounded-lg w-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="h-24 bg-slate-100 rounded-xl w-full" />
      </div>
    </div>
    <div className="flex justify-end gap-4 border-t pt-8 mt-12">
      <div className="h-12 bg-slate-200 rounded-lg w-36" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="w-full max-w-[1440px] mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-10 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
      <div className="lg:col-span-2 flex flex-col sm:flex-row gap-10 items-start">
        <div className="flex flex-col items-center sm:items-start gap-6 flex-shrink-0 w-full sm:w-auto">
          <div className="w-32 h-32 rounded-2xl bg-slate-200" />
          <div className="space-y-3 w-full sm:w-40">
            <div className="h-10 bg-slate-200 rounded-xl w-full" />
            <div className="h-10 bg-slate-200 rounded-xl w-full" />
          </div>
        </div>
        <div className="flex-1 space-y-5 w-full pt-2">
          <div className="flex items-center gap-3">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="h-6 bg-slate-200 rounded-full bg-slate-200 w-20" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-64" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-28" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
        </div>
      </div>
      <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
        <div className="h-4 bg-slate-200 rounded w-32" />
        <div className="space-y-4">
          <div className="h-16 bg-white border border-slate-100 rounded-xl w-full" />
          <div className="h-16 bg-white border border-slate-100 rounded-xl w-full" />
        </div>
        <div className="h-16 bg-white border border-slate-100 rounded-xl w-full" />
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse select-none">
    {/* Welcome Header */}
    <div className="h-44 bg-slate-200 rounded-3xl w-full" />

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded w-16" />
            <div className="h-3 bg-slate-200 rounded w-32" />
          </div>
        </div>
      ))}
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Area Chart */}
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-32" />
            <div className="h-3 bg-slate-200 rounded w-48" />
          </div>
          <div className="h-8 bg-slate-200 rounded-full w-36" />
        </div>
        <div className="h-[200px] bg-slate-100 rounded-xl w-full" />
      </div>

      {/* Pie Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="h-5 bg-slate-200 rounded w-40" />
          <div className="h-3 bg-slate-200 rounded w-28 mt-2" />
        </div>
        <div className="flex justify-center items-center py-4">
          <div className="w-36 h-36 rounded-full border-[14px] border-slate-200 flex items-center justify-center" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
        </div>
      </div>
    </div>

    {/* Activities & Explore banner */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-200 rounded w-48" />
          <div className="h-4 bg-slate-200 rounded w-16" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 border border-slate-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-36" />
                  <div className="h-3 bg-slate-200 rounded w-24" />
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl p-6 min-h-[250px] flex flex-col justify-between">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 bg-white/20 rounded w-36 animate-pulse" />
            <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
          </div>
        </div>
        <div className="h-10 bg-white/20 rounded-xl w-full animate-pulse" />
      </div>
    </div>
  </div>
);

export const DetailsSkeleton = () => (
  <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 antialiased animate-pulse">
    <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto py-12 md:py-20">
      {/* Breadcrumb */}
      <div className="h-4 bg-slate-200 rounded w-64 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
        {/* Image Panel */}
        <div className="lg:col-span-6 w-full">
          <div className="aspect-square w-full rounded-[32px] bg-slate-200" />
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-6 w-full flex flex-col justify-between">
          <div className="space-y-6">
            <div className="h-10 bg-slate-200 rounded-xl w-3/4" />

            {/* Artist Card */}
            <div className="flex items-center bg-white px-4 py-3 rounded-2xl border border-slate-100 max-w-fit gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-16" />
                <div className="h-4 bg-slate-200 rounded w-32" />
              </div>
            </div>

            <div className="h-4 bg-slate-200 rounded w-48 mb-4" />

            {/* Story */}
            <div className="bg-slate-100 rounded-2xl p-5 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-5/6" />
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm mt-8 space-y-4">
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-20" />
              <div className="h-8 bg-slate-200 rounded w-32" />
            </div>
            <div className="h-14 bg-slate-200 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const UserDashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">

      {/* Welcome Banner */}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

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

export const TopArtSkeleton = () => {
  const getGridClass = (index) => {
    switch (index) {
      case 0:
        return "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 lg:row-span-2";
      default:
        return "col-span-1";
    }
  };
  return (
    <section className="w-full bg-slate-50 py-20 animate-pulse">
      <div className="max-w-[80%] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div className="space-y-3 w-full sm:w-auto">
            <div className="h-8 bg-slate-200 rounded-xl w-64" />
            <div className="h-4 bg-slate-200 rounded-lg w-96 max-w-full" />
          </div>
          <div className="h-6 bg-slate-200 rounded-lg w-28 shrink-0" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className={`bg-white p-2 border border-slate-200 rounded-3xl ${getGridClass(index)}`}
            >
              <div className="w-full h-full bg-slate-200 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TopArtistSkeleton = () => (
  <section className="w-full max-w-[90%] md:max-w-[80%] mx-auto bg-[#f5f7ff] py-10 md:py-16 px-4 md:px-8 rounded-3xl border border-purple-200 my-12 animate-pulse">
    <div className="text-center mb-10 md:mb-12 flex flex-col items-center">
      <div className="h-8 bg-slate-200 rounded-xl w-48 mb-3" />
      <div className="h-4 bg-slate-200 rounded-lg w-80 max-w-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex flex-col items-center p-4">
          <div className="w-28 h-28 md:w-32 md:h-32 mb-4 rounded-full bg-slate-200 border-4 border-white" />
          <div className="h-6 bg-slate-200 rounded-lg w-36 mb-3" />
          <div className="h-4 bg-slate-200 rounded-lg w-28" />
        </div>
      ))}
    </div>
  </section>
);

export const CategorySkeleton = () => (
  <section className="py-12 px-4 max-w-[80%] mx-auto animate-pulse">
    <div className="flex justify-center mb-10">
      <div className="h-8 bg-slate-200 rounded-xl w-60" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="h-56 rounded-3xl bg-slate-200"
        />
      ))}
    </div>
  </section>
);