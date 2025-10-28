'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  owner_id: string;
}

interface User {
  id: string;
  username: string;
  name: string;
  location: string;
}

export default function PlaydateRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dogIdFromUrl = searchParams.get('dogId');

  const [formData, setFormData] = useState({
    dog_id: '',
    date: '',
    time: '',
    location: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDogs, setUserDogs] = useState<Dog[]>([]);
  const [targetDog, setTargetDog] = useState<Dog | null>(null);
  const [targetOwner, setTargetOwner] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/login');
          return;
        }
        setCurrentUser(user);

        // Fetch user's dogs
        const { data: dogsData, error: dogsError } = await supabase
          .from('dogs')
          .select('*')
          .eq('owner_id', user.id);

        if (dogsError) {
          console.error('Error fetching dogs:', dogsError);
        } else {
          setUserDogs(dogsData || []);
          // Pre-select first dog if available
          if (dogsData && dogsData.length > 0) {
            setFormData(prev => ({ ...prev, dog_id: dogsData[0].id }));
          }
        }

        // If a dog ID was passed from URL, fetch that dog's details
        if (dogIdFromUrl) {
          const { data: dogData, error: dogError } = await supabase
            .from('dogs')
            .select('*, owner_id')
            .eq('id', dogIdFromUrl)
            .single();

          if (!dogError && dogData) {
            setTargetDog(dogData);
            
            // Fetch the owner's profile
            const { data: ownerData, error: ownerError } = await supabase
              .from('profiles')
              .select('id, username, name, location')
              .eq('id', dogData.owner_id)
              .single();

            if (!ownerError && ownerData) {
              setTargetOwner(ownerData);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing page:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [dogIdFromUrl, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dog_id) {
      newErrors.dog_id = 'Please select your dog';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Please enter a location';
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      newErrors.date = 'Date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !targetDog) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = await supabase
        .from('playdate_requests')
        .insert({
          sender_id: currentUser.id,
          receiver_id: targetDog.owner_id,
          dog_id: formData.dog_id,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating playdate request:', error);
        setErrors({ submit: 'Failed to create playdate request. Please try again.' });
      } else {
        alert('Playdate request sent successfully!');
        router.push('/playdates');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!targetDog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Dog Selected</h2>
          <p className="text-white/80 mb-6">Please go back and select a dog to request a playdate.</p>
          <Button onClick={() => router.push('/browse')} className="bg-white text-blue-600 hover:bg-white/90">
            Browse Dogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-white text-center">
            Request Playdate with {targetOwner?.name || 'Dog Owner'}
          </h1>
          <p className="text-white/80 text-center mt-2">
            @{targetOwner?.username} • {targetOwner?.location}
          </p>
          <p className="text-white/70 text-center mt-2">
            For: {targetDog.name}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Dog */}
            {userDogs.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Dog
                </label>
                <select
                  value={formData.dog_id}
                  onChange={(e) => handleInputChange('dog_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.dog_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose your dog...</option>
                  {userDogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name} - {dog.breed} ({dog.size})
                    </option>
                  ))}
                </select>
                {errors.dog_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.dog_id}</p>
                )}
              </div>
            )}

            {userDogs.length === 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  You need to add a dog to your profile before requesting a playdate. 
                  <Button
                    type="button"
                    onClick={() => router.push('/profile/dog')}
                    className="ml-2 bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    Add Dog
                  </Button>
                </p>
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                error={errors.date}
                min={new Date().toISOString().split('T')[0]}
              />
              
              <Input
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                error={errors.time}
              />
            </div>

            {/* Location */}
            <Input
              label="Location"
              type="text"
              placeholder="e.g., Central Park, Dog Park, 123 Main St..."
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              error={errors.location}
            />

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || userDogs.length === 0}
                className="flex-1"
              >
                {isSubmitting ? 'Sending Request...' : 'Send Playdate Request'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

