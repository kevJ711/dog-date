'use client';

import Link from "next/link";

export default function DiscoveryCard() {
    //Test profile
    const profile = [
        "Bailey",
        "Calm, affectionate, gentle",
        "Mon-Fri 10:00am-2:00pm" ,
        "Hi there! I'm Daisy, a 3-year-old Golden Retriever with a heart full of love and a tail that never stops wagging. I adore meeting new people and am always up for a game of fetch or a cozy cuddle session. I'm well-socialized with both dogs and kids, and I promise to greet you with a big, slobbery kiss!"];
   return(
    <div className="p-8">
        <div className="bg-white w-auto rounded-3xl shadow-lg;">
                <div className="p-8"> 
                    <h1 className="text-black text-xl font-mono font-light;" >Meet: </h1>
                    <h2>{ profile[0] }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Temperment: </h1>
                    <h2>{ profile[1] }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Times Avalible: </h1>
                    <h2>{ profile[2] }</h2>
                    <h1 className="text-black text-xl font-mono font-light;" >Bio: </h1>
                    <h2>{ profile[3] }</h2> 
                </div>
            <div id="bottomsection" className="bg-gray border-t p-3 border-gray-200">
                <Link href="" className="text-center text-l">Request a playdate! → </Link>
            </div>          
        </div>
    </div>
   ); 
}