'use client';

import DiscoveryCard from "@/components/ui/DiscoveryCard";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LikesPage() {
  const router = useRouter();
  const [likedCards, setLikedCards] = useState<{ [key: string]: boolean }>({});
  const [animatedCards, setAnimatedCards] = useState<{ [key: string]: boolean }>({});
  const [likesGiven, setLikesGiven] = useState<any[]>([]);
  const [likesReceived, setLikesReceived] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [userDogs, setUserDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'liked' | 'liked_you' | 'matches'>('liked');
  const [searchQuery, setSearchQuery] = useState('');

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

      // Get auth token from Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      // Fetch likes from API with auth token
      const response = await fetch('/api/likes', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch likes');
      }

      const data = await response.json();
      
      // Handle error response from API
      if (data.error) {
        throw new Error(data.error);
      }
      

      setLikesGiven(Array.isArray(data.likes_given) ? data.likes_given : []);
      setLikesReceived(Array.isArray(data.likes_received) ? data.likes_received : []);
      setMatches(Array.isArray(data.matches) ? data.matches : []);


      const likedState: { [key: string]: boolean } = {};
      (data.likes_given || []).forEach((like: any) => {
        if (like && like.to_dog && like.to_dog.id) {
          likedState[like.to_dog.id] = true;
        }
      });
      setLikedCards(likedState);

    } catch (err: any) {
      console.error('Error in fetchLikes:', err);
      const errorMessage = err?.message || 'An unexpected error occurred';
      setError(errorMessage);
      // Don't set loading to false here if it's an auth error, let the redirect happen
      if (!err?.message?.includes('Unauthorized') && !err?.message?.includes('login')) {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle like function
  const toggleLike = async (cardId: string, fromDogId?: string) => {
    try {
      const isCurrentlyLiked = likedCards[cardId];

      const userDogId = fromDogId || userDogs[0]?.id;

      if (!userDogId) {
        console.error('No user dog found');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No active session');
        return;
      }

      let success = false;
      if (isCurrentlyLiked) {
        // Likes get removed from database
        console.log('Attempting to unlike:', { 
          from_dog_id: userDogId, 
          to_dog_id: cardId,
          userDogId_type: typeof userDogId,
          cardId_type: typeof cardId,
          usingProvidedFromDogId: !!fromDogId,
          userDogs: userDogs.map(d => d.id)
        });
        
        const response = await fetch('/api/likes', {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ from_dog_id: userDogId, to_dog_id: cardId }),
        });

        if (response.ok) {
          const result = await response.json().catch(() => ({}));
          console.log('Unlike response:', result);
          
          if (result.alreadyDeleted) {
            console.log('Like already deleted or never existed - treating as success');
            success = true;
          } else {
            // Verify the like was actually deleted by checking the database
            const { data: verifyLike } = await supabase
              .from('likes')
              .select('id')
              .eq('from_dog_id', userDogId)
              .eq('to_dog_id', cardId)
              .single();
            
            if (verifyLike) {
              console.error('Like still exists after delete!', verifyLike);
              alert('Failed to unlike: Like still exists in database. Please try again.');
              return;
            }
            
            success = true;
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error unliking dog:', errorData.error || 'Unknown error', response.status);
          alert(`Failed to unlike: ${errorData.error || 'Unknown error'}`);
          return;
        }
      } else {
        // Likes get added to database
        const response = await fetch('/api/likes', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ from_dog_id: userDogId, to_dog_id: cardId }),
        });

        if (response.ok) {
          success = true;
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error liking dog:', errorData.error || 'Unknown error');
          return;
        }
      }

      if (success) {
        // Update likedCards state 
        setLikedCards((prev) => ({
          ...prev,
          [cardId]: !prev[cardId],
        }));

        // Show animation
        setAnimatedCards((prev) => ({
          ...prev,
          [cardId]: true,
        }));

        if (isCurrentlyLiked) {
          
          setLikesGiven((prev) => {
            const filtered = prev.filter(like => {
              if (!like) return false; 
              const likeToDogId = like.to_dog_id || like.to_dog?.id;
              if (!likeToDogId) return false; 

              const matches = String(likeToDogId) !== String(cardId);
              if (!matches) {
                console.log('Removing like:', { likeToDogId, cardId, like });
              }
              return matches;
            });
            console.log('Filtering likesGiven:', { cardId, before: prev.length, after: filtered.length });
            return filtered;
          });
          setMatches((prev) => 
            prev.filter(match => {
              if (!match || !match.like_given) return true;
              const dogId = match.like_given.to_dog?.id || match.like_given.to_dog_id;
              if (!dogId) return true;
              return String(dogId) !== String(cardId);
            })
          );
        } else {
          await fetchLikes();
        }
      }
    } catch (err) {
      console.error('Error in toggleLike:', err);
    }
  };

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

  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string | null | undefined) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString();
    } catch (err) {
      console.error('Error formatting relative time:', err);
      return '';
    }
  };

  // Check if like is new (within 24 hours)
  const isNewLike = (timestamp: string | null | undefined) => {
    if (!timestamp) return false;
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return false;
      
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      return diffInHours < 24 && diffInHours >= 0;
    } catch (err) {
      console.error('Error checking if like is new:', err);
      return false;
    }
  };

  // Get dogs based on active tab with search filter
  const getDogsForTab = () => {
    let dogs: any[] = [];
    
    try {
      const safeLikesGiven = Array.isArray(likesGiven) ? likesGiven : [];
      const safeLikesReceived = Array.isArray(likesReceived) ? likesReceived : [];
      const safeMatches = Array.isArray(matches) ? matches : [];
      
      if (activeTab === 'liked') {
        dogs = safeLikesGiven
          .filter(like => like && like.to_dog)
          .map(like => ({
            ...like.to_dog,
            likeData: like,
            timestamp: like.created_at
          }));
      } else if (activeTab === 'liked_you') {
        dogs = safeLikesReceived
          .filter(like => like && like.from_dog)
          .map(like => ({
            ...like.from_dog,
            likeData: like,
            timestamp: like.created_at
          }));
      } else {
        dogs = safeMatches
          .filter(match => match && match.like_given && match.like_given.to_dog)
          .map(match => ({
            ...match.like_given.to_dog,
            likeData: match.like_given,
            timestamp: match.like_given?.created_at,
            isMatch: true
          }));
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        dogs = dogs.filter(dog => 
          dog && (
            dog.name?.toLowerCase().includes(query) ||
            dog.breed?.toLowerCase().includes(query) ||
            dog.owner?.name?.toLowerCase().includes(query) ||
            dog.owner?.username?.toLowerCase().includes(query)
          )
        );
      }
    } catch (err) {
      console.error('Error in getDogsForTab:', err);
      return [];
    }

    return dogs;
  };

  const dogs = useMemo(() => getDogsForTab(), [activeTab, likesGiven, likesReceived, matches, searchQuery]);

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
    <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 min-h-screen w-full pb-12">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_0_2px_#000000] mb-2">
          My Likes
        </h1>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, breed, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <button
            onClick={() => {
              setActiveTab('liked');
              setSearchQuery('');
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'liked'
                ? 'bg-white text-blue-600 shadow-xl scale-105'
                : 'bg-blue-400/50 text-white hover:bg-blue-400 shadow-lg'
            }`}
          >
            Dogs I Liked ({likesGiven.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('liked_you');
              setSearchQuery('');
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 relative ${
              activeTab === 'liked_you'
                ? 'bg-white text-pink-600 shadow-xl scale-105'
                : 'bg-blue-400/50 text-white hover:bg-blue-400 shadow-lg'
            }`}
          >
            Liked You ({likesReceived.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('matches');
              setSearchQuery('');
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'matches'
                ? 'bg-white text-green-600 shadow-xl scale-105'
                : 'bg-blue-400/50 text-white hover:bg-blue-400 shadow-lg'
            }`}
          >
            Matches ({matches.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4">
        {dogs.length === 0 ? (
          <div className="text-center py-20 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl mx-4">
            <div className="text-6xl mb-4">
              {activeTab === 'liked'}
              {activeTab === 'liked_you'}
              {activeTab === 'matches'}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {activeTab === 'liked'}
              {activeTab === 'liked_you'}
              {activeTab === 'matches' && "No matches yet!"}
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {activeTab === 'liked' && "Start exploring and like dogs to see them here!"}
              {activeTab === 'liked_you'}
              {activeTab === 'matches' && "Keep liking dogs to find your perfect match!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-6 pb-6">
            {dogs.map((dog) => {
              if (!dog || !dog.id) return null;
              
              const isNew = dog.timestamp && isNewLike(dog.timestamp);
              const isMatch = dog.isMatch;
              const dogId = dog.id || dog.likeData?.to_dog_id;
              
              if (!dogId) {
                console.warn('Dog without ID:', dog);
                return null;
              }
              
              return (
                <div
                  key={dogId}
                  className="h-full"
                >
                  <div className="relative h-full">
                    {isNew && (
                      <div className="absolute -top-2 -right-2 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        NEW
                      </div>
                    )}
                    <DiscoveryCard
                      dogId={dogId}
                      dogName={dog.name}
                      dogTemp={dog.temperament || 'Not specified'}
                      avalibility={dog.availability || 'Not specified'}
                      dogBio={formatDogBio(dog)}
                      photoUrl={dog.photo_url}
                      ownerName={dog.owner?.name || dog.owner?.username || 'Unknown Owner'}
                      ownerId={dog.owner?.id}
                      expandButton={
                        <div className="flex items-center justify-between w-full">
                          {dog.timestamp && (
                            <span className="text-xs text-gray-500 font-medium">
                              {formatRelativeTime(dog.timestamp)}
                            </span>
                          )}
                        </div>
                      }
                      likeButton={
                        <button 
                          onClick={async () => {
                            let fromDogId: string | undefined;
                            let toDogId: string;
                            
                            if (activeTab === 'liked_you') {
                          
                              toDogId = dogId; 

                              fromDogId = dog.likeData?.to_dog_id || userDogs[0]?.id;
                              
                              if (!fromDogId) {
                                console.error('No user dog found for liking back');
                                alert('Error: Cannot like - no dog profile found');
                                return;
                              }
                            } else {
                              fromDogId = dog.likeData?.from_dog_id;
                              toDogId = dog.likeData?.to_dog_id || dogId;
                              
                              if (!fromDogId) {
                                console.error('Missing from_dog_id for unlike:', { 
                                  dog, 
                                  likeData: dog.likeData 
                                });
                                alert('Error: Cannot unlike - missing like information');
                                return;
                              }
                            }
                            
                            console.log('Toggling like for dog:', { 
                              activeTab,
                              dogId, 
                              toDogId,
                              fromDogId,
                              likeData: dog.likeData,
                              currentLikedState: likedCards[toDogId] || likedCards[dogId]
                            });
                            
                            if (toDogId && fromDogId) {
                              toggleLike(toDogId, fromDogId);
                            } else {
                              console.error('Missing IDs:', { 
                                toDogId, 
                                fromDogId, 
                                dog,
                                likeData: dog.likeData
                              });
                              alert('Error: Missing required information');
                            }
                          }} 
                          className={`border-1 rounded-full border-gray-600 cursor-pointer p-1 transition-transform duration-300 ease-in-out ${
                            animatedCards[dogId] ? 'scale-125 rotate-360' : 'scale-100 rotate-0'
                          }`}
                        >
                          <svg 
                            fill={likedCards[dogId] ? '#f99716' : 'transparent'} 
                            stroke={likedCards[dogId] ? '#f99716' : 'gray'} 
                            width="32" 
                            height="32" 
                            viewBox="0 0 24 24" 
                            strokeWidth="1" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>

    </>
  );
}


