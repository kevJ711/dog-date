'use client';

export default function DiscoveryCard() {
    const profile = ["Name", "Times Avalible", "Temperment" ,"Bio"];
   return(
    <div className="p-8">
        <div className="bg-white w-auto p-8 rounded shadow-lg;">
                    <h1 className="text-black text-2xl font-mono;" >{ profile[0] }</h1>
                    <h1 className="text-black text-2xl font-mono;" >{ profile[1] }</h1>
                    <h1 className="text-black text-2xl font-mono;" >{ profile[2] }</h1>
                    <h1 className="text-black text-2xl font-mono;" >{ profile[3] }</h1>           
        </div>
    </div>
   ); 
}