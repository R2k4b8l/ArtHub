"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa6";
import Image from "next/image";

const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="bg-[#f5f7ff] text-slate-700 pt-12 md:pt-16 pb-8 border-t border-slate-300/40 animate__animated animate__fadeInUp">
      <div className="w-full max-w-[90%] md:max-w-[80%] mx-auto flex flex-col gap-10 md:gap-12 px-2 sm:px-4 md:px-0">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:justify-between gap-8 md:gap-10 lg:gap-4 items-start w-full">

          <div className="flex flex-col gap-4 md:gap-5 max-w-xs w-full">
            <Image src="/Assets/Logo.png" alt="ArtHub Logo" width={110} height={110} />
            <p className="text-gray-600 text-[13px] md:text-[13.5px] font-medium leading-relaxed">
              Empowering artists and collectors through a premium, curated digital
              gallery experience. Bridging the gap between creativity and ownership.
            </p>
            <div className="flex items-center gap-4 mt-1 md:mt-2">
              <a href="https://github.com/Abid-Hossain-Sifat" target="_blank" rel="noreferrer"
                className="p-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-white hover:bg-slate-900 hover:-translate-y-1 transition-all duration-300">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/abid-hossain-sifat" target="_blank" rel="noreferrer"
                className="p-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-white hover:bg-[#0077b5] hover:-translate-y-1 transition-all duration-300">
                <FaLinkedin className="w-4 h-4" fill="currentColor" strokeWidth={0} />
              </a>
              <a href="https://www.facebook.com/share/18ep55nz64/" target="_blank" rel="noreferrer"
                className="p-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-white hover:bg-[#1877f2] hover:-translate-y-1 transition-all duration-300">
                <FaFacebook className="w-4 h-4" fill="currentColor" strokeWidth={0} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 min-w-[150px]">
            <h4 className="text-slate-900 font-extrabold text-[14px] md:text-[15px] uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="flex flex-col gap-2.5 md:gap-3 text-[13.5px] md:text-[14px] font-semibold text-gray-600">
              {["Browse Artworks", "Featured Artists", "Collectibles", "Live Auctions"].map((item, index) => (
                <li key={index}>
                  <a href={"#" + item.toLowerCase().replace(/\s+/g, "-")}
                    className="hover:text-purple-700 transition-colors duration-300 whitespace-nowrap">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 min-w-[150px]">
            <h4 className="text-slate-900 font-extrabold text-[14px] md:text-[15px] uppercase tracking-wider">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 md:gap-3 text-[13.5px] md:text-[14px] font-semibold text-gray-600">
              {["About Us", "Terms of Service", "Privacy Policy", "Press Kit"].map((item, index) => (
                <li key={index}>
                  <a href={"#" + item.toLowerCase().replace(/\s+/g, "-")}
                    className="hover:text-purple-700 transition-colors duration-300 whitespace-nowrap">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 min-w-[150px]">
            <h4 className="text-slate-900 font-extrabold text-[14px] md:text-[15px] uppercase tracking-wider">
              Support
            </h4>
            <ul className="flex flex-col gap-2.5 md:gap-3 text-[13.5px] md:text-[14px] font-semibold text-gray-600">
              {["Help Center", "Artist FAQ", "Buying Guide", "Contact Us"].map((item, index) => (
                <li key={index}>
                  <a href={"#" + item.toLowerCase().replace(/\s+/g, "-")}
                    className="hover:text-purple-700 transition-colors duration-300 whitespace-nowrap">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-300/60 pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] md:text-xs font-bold text-gray-500 text-center sm:text-left">
          <p>© 2026 ArtHub. All rights reserved.</p>
          <p className="tracking-wide uppercase text-[9px] md:text-[10px] bg-slate-400/10 px-2.5 py-1 rounded-md text-slate-600">
            Designed By Abid Hossain Sifat
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;