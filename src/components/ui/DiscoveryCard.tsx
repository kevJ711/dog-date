'use client';

import Link from "next/link";
import Image from "next/image";

type DiscoveryCardProps = {
    dogId: string;
    dogName: string;
    dogTemp: string;
    avalibility: string;
    dogBio: string;
    photoUrl?: string;
    ownerName?: string;
    className?: string;
    likeButton: React.ReactNode;
    expandButton: React.ReactNode;
};

export default function DiscoveryCard({dogId, dogName, dogTemp, avalibility, dogBio, photoUrl, ownerName, likeButton, expandButton} : DiscoveryCardProps) {
   return(
    <div className="w-full h-full">
        <div className="bg-white w-auto rounded-3xl shadow-lg border-2 p-8 pt-2 pb-2 ">
                <div className="flex flex-row justify-end bg-gray-100 border-b p-3 border-gray-200">
                    {expandButton}
                </div>
                {/* Dog Photo Section */}
                <div className="p-4 flex justify-center">
                    {photoUrl ? (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                            <Image
                                src={photoUrl}
                                alt={`Photo of ${dogName}`}
                                fill
                                className="object-cover"
                                unoptimized={true}
                                onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = `
                                            <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        `;
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="p-6 h-64 overflow-y-auto"> 
                    <h1 className="text-black text-xl font-mono font-light;" >Meet: </h1>
                    <h2 className="text-gray-800 text-lg font-medium mb-1">{ dogName }</h2>
                    {ownerName && (
                        <p className="text-gray-600 text-sm mb-3">Owner: {ownerName}</p>
                    )}
                    <h1 className="text-black text-xl font-mono font-light;" >Temperment: </h1>
                    <h2 className="text-gray-800 text-lg font-medium mb-3">{ dogTemp }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Times Avalible: </h1>
                    <h2 className="text-gray-800 text-lg font-medium mb-3">{ avalibility }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Bio: </h1>
                    <h2 className="text-gray-800 text-lg font-medium">{ dogBio }</h2> 
                </div>
             <div id="bottomsection" className="flex flex-row justify-between items-center bg-gray-100 border-t p-3 border-gray-200">
                 <div>{likeButton}</div>
                 <Link href={`/playdate-request?dogId=${dogId}`} className="text-gray-800 text-lg font-medium hover:text-blue-600 transition-colors">Request a playdate! → </Link>
             </div>
        </div>
    </div>
   ); 
}