import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import HomePage from "../components/PopularList"
import NavbarGuest from "../components/NavbarGuest";
import Popular from "@/components/PopularList"
import NewRelease from "@/components/NewReleaseList"
import RecommendedList from "@/components/RecommendedList"


export default function Home() {
  return (
    <div className="">
      <Popular />
      <RecommendedList />
      <NewRelease />
    </div>
  );
}