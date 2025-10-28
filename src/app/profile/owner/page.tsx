"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio?: string;
  location?: string;
  created_at: string;
}

export default function OwnerProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Get current user's profile
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        return;
      }
      
      if (!user) {
        console.log('No user found');
        return;
      }

      console.log('User ID:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch profile:', error);
        // If no profile exists, create a basic one
        if (error.code === 'PGRST116') {
          console.log('No profile found, creating one...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: user.email?.split('@')[0] || 'User',
              username: user.email?.split('@')[0] || 'user'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Failed to create profile:', createError);
          } else {
            setProfile(newProfile);
            setFormData({
              name: newProfile.name || '',
              bio: newProfile.bio || '',
              location: newProfile.location || ''
            });
          }
        }
      } else {
        console.log('Profile found:', data);
        setProfile(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          location: data.location || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update(formData)
          .eq('id', user.id);

        if (error) {
          console.error('Failed to update profile:', error);
        } else {
          setEditing(false);
          fetchProfile(); // Refresh data
        }
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Owner Profile</h1>
        
        {profile ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-600">@{profile.username}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                </div>
                {profile.bio && <p className="text-gray-700 mb-2">{profile.bio}</p>}
                {profile.location && <p className="text-gray-600">📍 {profile.location}</p>}
              </div>
            )}
          </div>
        ) : (
          <p>No profile found</p>
        )}
      </div>
    </div>
  );
}
