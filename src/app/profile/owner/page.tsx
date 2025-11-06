'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Footer } from '@/components/layout/footer';

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  photo_url?: string;
}

export default function OwnerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
    preferredRadius: 10,
    allowMessages: true,
  });
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/login');
          return;
        }

        // Load user's email from auth
        const email = user.email || '';
        
        // Load existing profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profileError && profile) {
          setForm({
            name: profile.name || '',
            username: profile.username || '',
            email: profile.email || email, // Use profile email or fallback to auth email
            phone: profile.phone || '',
            city: profile.city || '',
            bio: profile.bio || '',
            preferredRadius: profile.preferredRadius || 10,
            allowMessages: profile.allowMessages ?? true,
          });
          // Load avatar URL if exists
          if (profile.avatar_url) {
            setAvatarUrl(profile.avatar_url);
          }
        } else {
          // If no profile exists, use auth email
          setForm(prev => ({ ...prev, email }));
        }

        // Load user's dogs
        const { data: dogsData, error: dogsError } = await supabase
          .from('dogs')
          .select('*')
          .eq('owner_id', user.id);

        if (!dogsError && dogsData) {
          setDogs(dogsData as Dog[]);
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === 'number') {
      setForm(f => ({ ...f, [name]: Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('You must be logged in to remove your avatar');
        return;
      }

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert('You must be logged in to remove your avatar');
        return;
      }

      // Update profile to remove avatar_url
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ avatar_url: null }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Avatar removal error:', data);
        alert(`Failed to remove avatar: ${data.error || 'Unknown error'}`);
        return;
      }

      setAvatarUrl(null);
      alert('Avatar removed successfully!');
      
      // Refresh the page to show updated avatar
      window.location.reload();
    } catch (err: any) {
      console.error('Error removing avatar:', err);
      alert(`Failed to remove avatar: ${err.message || 'Unknown error'}`);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPEG, etc.)');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }

      setUploading(true);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('You must be logged in to upload an avatar');
        return;
      }

      // Check if profile exists, create if not
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.email?.split('@')[0] || 'User',
            username: user.email?.split('@')[0] || 'user',
            email: user.email || ''
          });

        if (createError) {
          console.error('Error creating profile:', createError);
          alert(`Failed to create profile: ${createError.message}`);
          return;
        }
      }

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName; // Upload directly to bucket root, not in a folder

      // Try uploading to avatars bucket
      let uploadError = null;
      let publicUrl = '';

      // First, try to upload
      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadErr) {
        console.error('Upload error:', uploadErr);
        
        // If bucket doesn't exist or access denied, try alternative: use a public URL service or store as base64
        // For now, let's show a helpful error message
        if (uploadErr.message?.includes('bucket') || uploadErr.message?.includes('not found')) {
          alert('Storage bucket "avatars" not found. Please create it in Supabase Dashboard → Storage.');
        } else if (uploadErr.message?.includes('new row violates')) {
          alert('Permission denied. Please check storage bucket policies in Supabase.');
        } else {
          alert(`Upload failed: ${uploadErr.message}. Please check browser console for details.`);
        }
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      publicUrl = urlData.publicUrl;

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        alert(`Failed to update profile: ${updateError.message}`);
        return;
      }

      setAvatarUrl(publicUrl);
      alert('Avatar uploaded successfully!');
      
      // Refresh the page to show updated avatar
      window.location.reload();
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      alert(`Failed to upload avatar: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('You must be logged in to save your profile');
        router.push('/login');
        return;
      }

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Profile save error:', data);
        alert(`Failed to save profile: ${data.error || 'Unknown error'}`);
        return;
      }
      
      alert('Profile saved successfully');
      // Reload data to show updated profile
      window.location.reload();
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Profile</h1>
        <p className="text-gray-600 mb-8">Manage your personal information!</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden ring-2 ring-white bg-gray-100">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Owner avatar"
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">{form.name || 'Your Name'}</div>
                    <div className="text-gray-500">@{form.username || 'username'}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Avatar</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-700 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG/JPG up to 2MB.</p>
                  {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                </div>

                <div className="mt-6">
                  <Button className="w-full" onClick={onSave}>Save Changes</Button>
                  {avatarUrl && (
                    <Button 
                      variant="secondary" 
                      className="w-full mt-2" 
                      type="button"
                      onClick={handleRemoveAvatar}
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          <section className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Your full name"
                    />
                    <Input
                      label="Username"
                      name="username"
                      value={form.username}
                      onChange={onChange}
                      placeholder="yourhandle"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="you@example.com"
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="(555) 555-1234"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={onChange}
                      placeholder="City, State"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Match Radius (miles)</label>
                      <input
                        type="number"
                        name="preferredRadius"
                        min={1}
                        max={100}
                        value={form.preferredRadius}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={form.bio}
                      onChange={onChange}
                      placeholder="Tell other owners about you and your pup!"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="submit">Save Profile</Button>
                    <Button type="button" variant="secondary" onClick={() => history.back()}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">My Dogs</h2>
                  <Button size="sm" asChild>
                    <Link href="/profile/dog">Add Dog</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {dogs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't added any dogs yet.</p>
                    <Button size="sm" asChild>
                      <Link href="/profile/dog">Add Your First Dog</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {dogs.map((dog) => (
                      <div key={dog.id} className="border rounded-lg p-4 flex gap-3 bg-white">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
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
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{dog.name}</div>
                          <div className="text-sm text-gray-500">
                            {dog.breed} • {dog.age} {dog.age === 1 ? 'yr' : 'yrs'} old
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="secondary" asChild>
                              <Link href={`/profile/dog?dogId=${dog.id}`}>Edit</Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/profile/dog?dogId=${dog.id}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
