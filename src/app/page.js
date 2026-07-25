import Banner from "@/Components/Banner";
import Category from "@/Components/Category";
import JoinArtHub from "@/Components/JoinArtHub";
import Navbar from "@/Components/Navbar";
import TopArt from "@/Components/TopArt";
import TopArtist from "@/Components/TopArtist";
import WhyArtHub from "@/Components/WhyArtHub";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <TopArt></TopArt>
      <TopArtist></TopArtist>
      <Category></Category>
      <WhyArtHub></WhyArtHub>
      <JoinArtHub></JoinArtHub>
    </div>
  );
}
