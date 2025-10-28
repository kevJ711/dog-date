'use client';
import DiscoveryCard from "@/components/ui/DiscoveryCard";
import { useState, useEffect } from "react";


export default function Discover() {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [likedCards, setLikedCards] = useState<{ [key: string]: boolean }>({});
  const [animatedCards, setAnimatedCards] = useState<{ [key: string]: boolean }>({});

  //Toggle Function
  function toggleLike(cardId: string) {
  setLikedCards((prev) => ({
    ...prev,
    [cardId]: !prev[cardId],
  }));
  setAnimatedCards((prev) => ({
    ...prev,
    [cardId]: true,
  }));
}

  //Animation timer
  useEffect(() => {
  const timers: NodeJS.Timeout[] = [];

  Object.entries(animatedCards).forEach(([cardId, isAnimating]) => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        setAnimatedCards((prev) => ({
          ...prev,
          [cardId]: false,
        }));
      }, 300);
      timers.push(timeout);
    }
  });

  return () => timers.forEach(clearTimeout);
}, [animatedCards]);



  //Test profile/Dummy Data
    const profileCards = [
    {
      dogId: "1234",
      dogName: "Bailey",
      dogTemp: "Calm, affectionate, gentle",
      avalibility: "Mon-Fri 10:00am-2:00pm" ,
      dogBio: "Hi there! I'm Daisy, a 3-year-old Golden Retriever with a heart full of love and a tail that never stops wagging. I adore meeting new people and am always up for a game of fetch or a cozy cuddle session. I'm well-socialized with both dogs and kids, and I promise to greet you with a big, slobbery kiss!"
    },
    {
    dogId: "1",
    dogName: "Buddy",
    dogTemp: "Warm",
    avalibility: "Available",
    dogBio: "Loves to play fetch.",
    },
    {
      dogId: "2",
      dogName: "Max",
      dogTemp: "Cool",
      avalibility: "Busy",
      dogBio: "Enjoys long walks.",
    }];
        

  return(
    <>
    <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 min-h-screen w-full">
    <h1 className="text-center text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_0_2px_#000000] pt-5">Discover</h1>
    <div className="relative">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] p-3 gap-4">
        {profileCards.map((card) => (
          <div
            key={card.dogId}
            className="cursor-pointer"
          >
            <DiscoveryCard
              dogId={card.dogId}
              dogName={card.dogName}
              dogTemp={card.dogTemp}
              avalibility={card.avalibility}
              dogBio={card.dogBio}
              expandButton={
                <button onClick={() => setExpandedCardId(card.dogId)} className=" text-gray-500 text-2xl">&#8599;</button>
              }
              likeButton={
            <button onClick={() => toggleLike(card.dogId)} className={`border-2 rounded-full border-gray-600 cursor-pointer p-1 transition-transform duration-300 ease-in-out ${animatedCards[card.dogId] ? 'scale-125' : 'scale-100'}`}>
              <svg fill={likedCards[card.dogId] ? 'pink': 'none' } stroke={likedCards[card.dogId] ? 'black': 'gray'} width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          }
            />
          </div>
        ))}
      </div>
    </div> 
    </div> 

  {expandedCardId && (
  <div
    className="fixed inset-0 z-40"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    onClick={() => setExpandedCardId(null)}
  />
)}

  {expandedCardId && (
    <div
      className="fixed top-1/2 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 z-50 overflow-auto"
    >
    {/* Find and render the expanded dog card */}
    {profileCards
      .filter((card) => card.dogId === expandedCardId)
      .map((card) => (
        <div
          key={card.dogId}
          className="cursor-pointer"
          onClick={() => setExpandedCardId(card.dogId)}
        >
        <DiscoveryCard
          dogId={card.dogId}
          dogName={card.dogName}
          dogTemp={card.dogTemp}
          avalibility={card.avalibility}
          dogBio={card.dogBio}
          expandButton={
                <button onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCardId(null)
                }} className="text-gray-500 text-2xl">&times;</button>
              }
          likeButton={
            <button onClick={() => toggleLike(card.dogId)} className={`border-2 rounded-full border-gray-600 cursor-pointer p-1 transition-transform duration-300 ease-in-out ${animatedCards[card.dogId] ? 'scale-125' : 'scale-100'}`}>
              <svg fill={likedCards[card.dogId] ? 'pink': 'none' } stroke={likedCards[card.dogId] ? 'black': 'gray'} width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          }
          />
        </div>
      ))}
  </div>
)}


  </>
  )
}
