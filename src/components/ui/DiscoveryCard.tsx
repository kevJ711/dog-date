'use client';

import Link from "next/link";

type DiscoveryCardProps = {
    dogId: string;
    dogName: string;
    dogTemp: string;
    avalibility: string;
    dogBio: string;
    className?: string;
    likeButton: React.ReactNode;
    expandButton: React.ReactNode;
};

export default function DiscoveryCard({dogId, dogName, dogTemp, avalibility, dogBio, likeButton, expandButton} : DiscoveryCardProps) {
   return(
    <div className="w-full h-full">
        <div className="bg-white w-auto rounded-3xl shadow-lg border-2 p-8 pt-2 pb-2 ">
                <div className="flex flex-row justify-end  bg-gray border-b p-3 border-gray-200">
                    {expandButton}
                </div>
                <div className="p-6 h-64 overflow-y-auto"> 
                    <h1 className="text-black text-xl font-mono font-light;" >Meet: </h1>
                    <h2>{ dogName }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Temperment: </h1>
                    <h2>{ dogTemp }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Times Avalible: </h1>
                    <h2>{ avalibility }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Bio: </h1>
                    <h2>{ dogBio }</h2> 
                </div>
             <div id="bottomsection" className="flex flex-row justify-between items-center bg-gray border-t p-3 border-gray-200">
                 <div>{likeButton}</div>
                 <Link href={`/playdate-request?dogId=${dogId}`} className="text-l hover:text-blue-600 transition-colors">Request a playdate! → </Link>
             </div>
        </div>
    </div>
   ); 
}