'use client';
import DiscoveryCard from "./DiscoveryCard";

/*type DiscoverProps = {
  buttons?: React.ReactNode; // Accepts 0, 1, or multiple buttons
};*/

export default function Discover() {
  return(
    <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 ">
      <h1>Discover</h1>
      <div className="flex grid-cols-3 p-3">
        <DiscoveryCard/>
        <DiscoveryCard/>
        <DiscoveryCard/>
      </div>
    </div>
  )

}