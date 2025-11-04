'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface PublicProfile {
  id: string;
  name?: string;
  username?: string;
  location?: string;
  bio?: string;
  email?: string;
  phone?: string;
  city?: string;
  avatar_url?: string;
}

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  temperament?: string;
  photo_url?: string;
}

export default function PublicOwnerProfilePage() {
  const params = useParams<{ id: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!params?.id) {
          setLoading(false);
          return;
        }

        // Load profile
        console.log('Loading profile for ID:', params.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, username, location, bio, email, phone, city, avatar_url')
          .eq('id', params.id)
          .single();
        
        if (profileError) {
          console.error('Profile error:', profileError);
          console.error('Error code:', profileError.code);
          console.error('Error message:', profileError.message);
          
          // If profile doesn't exist (PGRST116 = no rows returned), create a minimal profile
          if (profileError.code === 'PGRST116') {
            console.log('Profile not found, creating minimal profile object');
            setProfile({
              id: params.id,
              name: 'User',
              username: 'No username set',
              bio: 'This user hasn\'t set up their profile yet.',
            });
          } else {
            // Other error - still show something
            setProfile({
              id: params.id,
              name: 'User',
              username: 'Unable to load',
              bio: 'Unable to load profile information.',
            });
          }
        } else if (profileData) {
          console.log('Profile loaded successfully:', profileData);
          setProfile(profileData as PublicProfile);
        }

        // Load owner's dogs (this should work even if profile doesn't exist)
        const { data: dogsData, error: dogsError } = await supabase
          .from('dogs')
          .select('*')
          .eq('owner_id', params.id);

        if (!dogsError && dogsData) {
          setDogs(dogsData as Dog[]);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) load();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-4">
          <p className="text-gray-600 text-lg mb-4">Unable to load profile.</p>
          <p className="text-gray-500 text-sm mb-6">This user may not have set up their profile yet.</p>
          <Link href="/browse" className="text-blue-600 hover:underline inline-block px-4 py-2 bg-blue-50 rounded-md">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.name || 'Owner'}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.name || 'Owner'}</h1>
              {profile.username && <p className="text-gray-600 mb-3">@{profile.username}</p>}
              {profile.bio && <p className="text-gray-800 mb-4">{profile.bio}</p>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.city && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{profile.city}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline">
                      {profile.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Owner's Dogs Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Their Dogs</h2>
          {dogs.length === 0 ? (
            <p className="text-gray-600">No dogs added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dogs.map((dog) => (
                <div key={dog.id} className="border rounded-lg p-4 flex gap-3 bg-gray-50 hover:shadow-md transition-shadow">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {dog.photo_url ? (
                      <Image
                        src={dog.photo_url}
                        alt={dog.name}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{dog.name}</div>
                    <div className="text-sm text-gray-500">
                      {dog.breed} • {dog.age} {dog.age === 1 ? 'yr' : 'yrs'} old
                    </div>
                    {dog.temperament && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {dog.temperament}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


