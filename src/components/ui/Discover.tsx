'use client';
import DiscoveryCard from "@/components/ui/DiscoveryCard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function Discover() {
  const router = useRouter();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [likedCards, setLikedCards] = useState<{ [key: string]: boolean }>({});
  const [animatedCards, setAnimatedCards] = useState<{ [key: string]: boolean }>({});
  const [dogs, setDogs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userDogs, setUserDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Toggle Function
  const toggleLike = async (cardId: string) => {
    try {
      const isCurrentlyLiked = likedCards[cardId];
      const userDogId = userDogs[0]?.id; // Use first dog for now

      if (!userDogId) {
        console.error('No user dog found');
        return;
      }

      if (isCurrentlyLiked) {
        // Unlike: remove from database
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('from_dog_id', userDogId)
          .eq('to_dog_id', cardId);

        if (error) {
          console.error('Error unliking dog:', error);
          return;
        }
      } else {
        // Like: add to database
        const { error } = await supabase
          .from('likes')
          .insert({
            from_dog_id: userDogId,
            to_dog_id: cardId
          });

        if (error) {
          console.error('Error liking dog:', error);
          return;
        }
      }

      // Update UI state
      setLikedCards((prev) => ({
        ...prev,
        [cardId]: !prev[cardId],
      }));
      setAnimatedCards((prev) => ({
        ...prev,
        [cardId]: true,
      }));
    } catch (err) {
      console.error('Error in toggleLike:', err);
    }
  };

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



  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/login');
        return;
      }

      setCurrentUser(user);

      // Fetch user's dogs to get their IDs for likes
      const { data: userDogsData, error: userDogsError } = await supabase
        .from('dogs')
        .select('id')
        .eq('owner_id', user.id);

      if (userDogsError) {
        console.error('Error fetching user dogs:', userDogsError);
        setError('Failed to load your dogs');
        return;
      }

      setUserDogs(userDogsData || []);

      // If user has no dogs, show message
      if (!userDogsData || userDogsData.length === 0) {
        setError('Please create a dog profile first to discover other dogs!');
        setLoading(false);
        return;
      }

      // Fetch all dogs except current user's dogs
      const { data: dogsData, error: dogsError } = await supabase
        .from('dogs')
        .select('*, profiles!dogs_owner_id_fkey(name, username)')
        .neq('owner_id', user.id);

      if (dogsError) {
        console.error('Error fetching dogs:', dogsError);
        setError('Failed to load dogs');
        return;
      }

      setDogs(dogsData || []);

      // Fetch existing likes for current user's dogs
      if (userDogsData.length > 0) {
        const userDogIds = userDogsData.map(dog => dog.id);
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('to_dog_id')
          .in('from_dog_id', userDogIds);

        if (likesError) {
          console.error('Error fetching likes:', likesError);
        } else {
          // Create liked cards state
          const likedState: { [key: string]: boolean } = {};
          likesData?.forEach(like => {
            likedState[like.to_dog_id] = true;
          });
          setLikedCards(likedState);
        }
      }

    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
        

  // Helper function to format dog bio
  const formatDogBio = (dog: any) => {
    const parts = [];
    if (dog.breed) parts.push(`Breed: ${dog.breed}`);
    if (dog.age) parts.push(`Age: ${dog.age} years old`);
    if (dog.size) parts.push(`Size: ${dog.size}`);
    if (dog.temperament) parts.push(`Temperament: ${dog.temperament}`);
    if (dog.vaccination_status) parts.push(`Vaccination: ${dog.vaccination_status}`);
    
    return parts.join(' • ') || 'No additional information available';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading dogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 min-h-screen w-full flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return(
    <>
    <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 min-h-screen w-full">
    <h1 className="text-center text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_0_2px_#000000] pt-5">Discover</h1>
    <div className="relative">
      {dogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white text-xl">No dogs to discover yet!</p>
          <p className="text-white text-lg mt-2">Check back later for new furry friends.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr p-3 gap-6">
          {dogs.map((dog) => (
            <div
              key={dog.id}
              className="cursor-pointer h-full"
            >
              <DiscoveryCard
                dogId={dog.id}
                dogName={dog.name}
                dogTemp={dog.temperament || 'Not specified'}
                avalibility={dog.availability || 'Not specified'}
                dogBio={formatDogBio(dog)}
                photoUrl={dog.photo_url}
                ownerName={dog.profiles?.name || dog.profiles?.username || 'Unknown Owner'}
                expandButton={
                  <button onClick={() => setExpandedCardId(dog.id)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <span className="text-sm font-medium">View Details</span>
                    <span className="text-2xl">&#8599;</span>
                  </button>
                }
                likeButton={
              <button onClick={() => toggleLike(dog.id)} className={`border-1 rounded-full border-gray-600 cursor-pointer p-1 transition-transform duration-300 ease-in-out ${animatedCards[dog.id] ? 'scale-125 rotate-360' : 'scale-100 rotate-0'}`}>
                <svg fill={likedCards[dog.id] ? '#f99716' : 'transparent' } stroke={likedCards[dog.id] ? '#f99716': 'gray'} width="32" height="32" viewBox="0 0 24 24" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            }
              />
            </div>
          ))}
        </div>
      )}
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
    {dogs
      .filter((dog) => dog.id === expandedCardId)
      .map((dog) => (
        <div
          key={dog.id}
          className="cursor-pointer"
          onClick={() => setExpandedCardId(dog.id)}
        >
        <DiscoveryCard
          dogId={dog.id}
          dogName={dog.name}
          dogTemp={dog.temperament || 'Not specified'}
          avalibility={dog.availability || 'Not specified'}
          dogBio={formatDogBio(dog)}
          photoUrl={dog.photo_url}
          ownerName={dog.profiles?.name || dog.profiles?.username || 'Unknown Owner'}
          expandButton={
                <button onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCardId(null)
                }} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <span className="text-sm font-medium">Close</span>
                  <span className="text-2xl">&times;</span>
                </button>
              }
          likeButton={
            <button onClick={() => toggleLike(dog.id)} className={`border-1 rounded-full border-gray-600 cursor-pointer p-1 transition-transform duration-300 ease-in-out ${animatedCards[dog.id] ? 'scale-125 rotate-360' : 'scale-100 rotate-0'}`}>
              <svg fill={likedCards[dog.id] ? '#f99716' : 'transparent' } stroke={likedCards[dog.id] ? '#f99716': 'gray'} width="32" height="32" viewBox="0 0 24 24" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
