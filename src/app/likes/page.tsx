'use client';

import DiscoveryCard from "@/components/ui/DiscoveryCard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LikesPage() {
  const router = useRouter();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [likedCards, setLikedCards] = useState<{ [key: string]: boolean }>({});
  const [animatedCards, setAnimatedCards] = useState<{ [key: string]: boolean }>({});
  const [likesGiven, setLikesGiven] = useState<any[]>([]);
  const [likesReceived, setLikesReceived] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userDogs, setUserDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'liked' | 'liked_you' | 'matches'>('liked');

  // Fetch likes data
  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
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

      // Fetch user's dogs
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

      if (!userDogsData || userDogsData.length === 0) {
        setError('Please create a dog profile first to see your likes!');
        setLoading(false);
        return;
      }

      // Fetch likes from API
      const response = await fetch('/api/likes');
      if (!response.ok) {
        throw new Error('Failed to fetch likes');
      }

      const data = await response.json();
      setLikesGiven(data.likes_given || []);
      setLikesReceived(data.likes_received || []);
      setMatches(data.matches || []);

      // Set liked cards state
      const likedState: { [key: string]: boolean } = {};
      (data.likes_given || []).forEach((like: any) => {
        if (like.to_dog) {
          likedState[like.to_dog.id] = true;
        }
      });
      setLikedCards(likedState);

    } catch (err) {
      console.error('Error in fetchLikes:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Toggle like function
  const toggleLike = async (cardId: string) => {
    try {
      const isCurrentlyLiked = likedCards[cardId];
      const userDogId = userDogs[0]?.id;

      if (!userDogId) {
        console.error('No user dog found');
        return;
      }

      if (isCurrentlyLiked) {
        // Unlike: remove from database
        const response = await fetch('/api/likes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from_dog_id: userDogId, to_dog_id: cardId }),
        });

        if (!response.ok) {
          console.error('Error unliking dog');
          return;
        }
      } else {
        // Like: add to database
        const response = await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from_dog_id: userDogId, to_dog_id: cardId }),
        });

        if (!response.ok) {
          console.error('Error liking dog');
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

      // Refresh likes data
      fetchLikes();
    } catch (err) {
      console.error('Error in toggleLike:', err);
    }
  };

  // Animation timer
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

  // Get dogs based on active tab
  const getDogsForTab = () => {
    if (activeTab === 'liked') {
      return likesGiven.map(like => like.to_dog).filter(Boolean);
    } else if (activeTab === 'liked_you') {
      return likesReceived.map(like => like.from_dog).filter(Boolean);
    } else {
      return matches.map(match => match.like_given.to_dog).filter(Boolean);
    }
  };

  const dogs = getDogsForTab();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading likes...</p>
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
            onClick={fetchLikes}
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
      <h1 className="text-center text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_0_2px_#000000] pt-5">My Likes</h1>
      
      {/* Tabs */}
      <div className="flex justify-center gap-4 mt-6 mb-6">
          <button
            onClick={() => setActiveTab('liked')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'liked'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-blue-400/50 text-white hover:bg-blue-400'
            }`}
          >
            Dogs I Liked ({likesGiven.length})
          </button>
          <button
            onClick={() => setActiveTab('liked_you')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'liked_you'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-blue-400/50 text-white hover:bg-blue-400'
            }`}
          >
            Liked You ({likesReceived.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'matches'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-blue-400/50 text-white hover:bg-blue-400'
            }`}
          >
            Matches ({matches.length})
          </button>
        </div>

      <div className="relative">
        {dogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white text-xl">
              {activeTab === 'liked' && "You haven't liked any dogs yet!"}
              {activeTab === 'liked_you' && "No one has liked your dogs yet!"}
              {activeTab === 'matches' && "No matches yet. Keep liking to find your dog's perfect match!"}
            </p>
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
                  ownerName={dog.owner?.name || dog.owner?.username || 'Unknown Owner'}
                  expandButton={
                    <button onClick={() => setExpandedCardId(dog.id)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                      <span className="text-sm font-medium">View Details</span>
                      <span className="text-2xl">&#8599;</span>
                    </button>
                  }
                  likeButton={
                    <button onClick={() => toggleLike(dog.id)} className={`border-1 rounded-full border-gray-600 cursor-pointer p-1 transition-transform duration-300 ease-in-out ${animatedCards[dog.id] ? 'scale-125 rotate-360' : 'scale-100 rotate-0'}`}>
                      <svg fill={likedCards[dog.id] ? '#f99716' : 'transparent'} stroke={likedCards[dog.id] ? '#f99716' : 'gray'} width="32" height="32" viewBox="0 0 24 24" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
                ownerName={dog.owner?.name || dog.owner?.username || 'Unknown Owner'}
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
                    <svg fill={likedCards[dog.id] ? '#f99716' : 'transparent'} stroke={likedCards[dog.id] ? '#f99716' : 'gray'} width="32" height="32" viewBox="0 0 24 24" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
  );
}

