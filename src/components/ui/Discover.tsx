'use client';
import DiscoveryCard from "@/components/ui/DiscoveryCard";
import { useEffect } from 'react';
import { useDogStore } from '@/lib/stores/dog-store';

export default function Discover() {
  const fetchDogs = useDogStore(s => s.fetchDogs);
  const isLoading = useDogStore(s => s.isLoading);
  const dogs = useDogStore(s => s.filteredDogs);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  return(
    <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 ">
      <h1 className="text-center text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_0_2px_#000000] pt-5">Discover</h1>
      <div className="flex grid-cols-3 p-3">
        {isLoading && <div className="text-white">Loading...</div>}
        {!isLoading && dogs.length === 0 && (
          <div className="text-white">No dogs found.</div>
        )}
        {!isLoading && dogs.map(dog => (
          <DiscoveryCard key={dog.id} dog={dog} />
        ))}
      </div>
    </div>
  )

}