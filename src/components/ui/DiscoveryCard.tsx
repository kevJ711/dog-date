'use client';

import Link from "next/link";
import { Dog } from '@/types';
import { useDogStore } from '@/lib/stores/dog-store';

export default function DiscoveryCard({ dog }: { dog: Dog }) {
   const likeDog = useDogStore(s => s.likeDog);
   const unlikeDog = useDogStore(s => s.unlikeDog);
   const likedDogs = useDogStore(s => s.likedDogs);
   const setSelectedDog = useDogStore(s => s.setSelectedDog);

   const isLiked = likedDogs.includes(dog.id);

   const onToggleLike = async () => {
     // Ensure we like from this dog if the user is viewing their own dog card; otherwise, rely on currently selected dog
     setSelectedDog(dog);
     if (isLiked) {
       await unlikeDog(dog.id);
     } else {
       await likeDog(dog.id);
     }
   };

   return(
    <div className="p-8">
        <div className="bg-white w-auto rounded-3xl shadow-lg;">
                <div className="p-8"> 
                    {dog.photo_url && (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={dog.photo_url}
                          alt={dog.name}
                          className="w-32 h-32 object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <h1 className="text-black text-xl font-mono font-light;" >Meet: </h1>
                    <h2>{ dog.name }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Temperament: </h1>
                    <h2>{ dog.temperament ?? '—' }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Breed: </h1>
                    <h2>{ dog.breed }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Age: </h1>
                    <h2>{ dog.age } years old</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Size: </h1>
                    <h2>{ dog.size }</h2>
                </div>
            <div id="bottomsection" className="bg-gray border-t p-3 border-gray-200">
                <button onClick={onToggleLike} className="text-center text-l">
                  {isLiked ? 'Unlike' : 'Like'} →
                </button>
            </div>          
        </div>
    </div>
   ); 
}