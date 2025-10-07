'use client';
import DiscoveryCard from "@/components/ui/DiscoveryCard";

export default function Discover() {
  return(
    <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 ">
      <h1 className="text-center text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_0_2px_#000000] pt-5">Discover</h1>
      <div className="flex grid-cols-3 p-3">
        <DiscoveryCard/>
        <DiscoveryCard/>
        <DiscoveryCard/>
      </div>
    </div>
  )

}