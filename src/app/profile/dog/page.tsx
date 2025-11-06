"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Dog {
  id: string;
  owner_id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  temperament?: string;
  vaccination_status: string;
  photo_url?: string;
  created_at: string;
}

export default function DogProfilePage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: 0,
    size: '',
    temperament: '',
    vaccination_status: '',
    photo_url: ''
  });

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      
      // Get current user first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        return;
      }
      
      if (!user) {
        console.log('No user found');
        return;
      }

      console.log('Fetching dogs for user:', user.id);
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Failed to fetch dogs:', error);
      } else {
        console.log('Dogs found:', data);
        setDogs(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch dogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dog: Dog) => {
    setEditing(dog.id);
    setFormData({
      name: dog.name,
      breed: dog.breed,
      age: dog.age,
      size: dog.size,
      temperament: dog.temperament || '',
      vaccination_status: dog.vaccination_status,
      photo_url: dog.photo_url || ''
    });
  };

  const handleSave = async (dogId: string) => {
    try {
      const { error } = await supabase
        .from('dogs')
        .update(formData)
        .eq('id', dogId);

      if (error) {
        console.error('Failed to update dog:', error);
      } else {
        setEditing(null);
        fetchDogs(); // Refresh data
      }
    } catch (err) {
      console.error('Failed to update dog:', err);
    }
  };

  const handleDelete = async (dogId: string) => {
    if (confirm('Are you sure you want to delete this dog?')) {
      try {
        const { error } = await supabase
          .from('dogs')
          .delete()
          .eq('id', dogId);

        if (error) {
          console.error('Failed to delete dog:', error);
        } else {
          fetchDogs(); // Refresh data
        }
      } catch (err) {
        console.error('Failed to delete dog:', err);
      }
    }
  };

  const handleAdd = () => {
    setAdding(true);
    setFormData({
      name: '',
      breed: '',
      age: 0,
      size: 'Medium',
      temperament: '',
      vaccination_status: 'Up to date',
      photo_url: ''
    });
  };

  const handleSaveNew = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to create a dog profile.');
        return;
      }

      // Ensure profile exists (since owner_id references profiles.id)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id, // profiles.id must match auth.users.id
            name: user.email?.split('@')[0] || 'User',
            username: user.email?.split('@')[0] || null,
            email: user.email || null,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          alert(`Failed to create profile: ${profileError.message}. Please set up your profile first.`);
          return;
        }
      }

      // Prepare data, excluding empty photo_url
      const dogData = {
        owner_id: user.id, // This should match profiles.id which references auth.users.id
        name: formData.name,
        breed: formData.breed,
        age: formData.age || 0,
        size: formData.size,
        temperament: formData.temperament || null,
        vaccination_status: formData.vaccination_status,
        ...(formData.photo_url && { photo_url: formData.photo_url })
      };

      const { error } = await supabase
        .from('dogs')
        .insert(dogData);

      if (error) {
        console.error('Failed to create dog:', error.message || error);
        alert(`Failed to create dog: ${error.message || 'Unknown error'}`);
      } else {
        setAdding(false);
        fetchDogs(); // Refresh data
        // Reset form
        setFormData({
          name: '',
          breed: '',
          age: 0,
          size: 'Medium',
          temperament: '',
          vaccination_status: 'Up to date',
          photo_url: ''
        });
      }
    } catch (err) {
      console.error('Failed to create dog:', err);
      alert('Failed to create dog. Please try again.');
    }
  };

  if (loading) return <div>Loading dogs...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dog Profiles</h1>
        
        <div className="mb-6">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add New Dog
          </button>
        </div>

        {adding && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Dog</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-900">Breed</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Age</label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Size</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Temperament</label>
                <textarea
                  value={formData.temperament}
                  onChange={(e) => setFormData({...formData, temperament: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Vaccination Status</label>
                <input
                  type="text"
                  value={formData.vaccination_status}
                  onChange={(e) => setFormData({...formData, vaccination_status: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Photo URL (Optional)</label>
                <input
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                  placeholder="https://example.com/dog-photo.jpg"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                />
                <p className="text-sm text-gray-600 mt-1">
                  You can upload a photo to a service like Cloudinary and paste the URL here
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Dog
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {dogs.length === 0 ? (
          <p className="text-gray-600">No dogs found. Add your first dog!</p>
        ) : (
          <div className="space-y-6">
            {dogs.map((dog) => (
              <div key={dog.id} className="bg-white p-6 rounded-lg shadow-md">
                {editing === dog.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium text-gray-900">Breed</label>
                        <input
                          type="text"
                          value={formData.breed}
                          onChange={(e) => setFormData({...formData, breed: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900">Size</label>
                        <select
                          value={formData.size}
                          onChange={(e) => setFormData({...formData, size: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                        >
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">Temperament</label>
                      <textarea
                        value={formData.temperament}
                        onChange={(e) => setFormData({...formData, temperament: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">Vaccination Status</label>
                      <input
                        type="text"
                        value={formData.vaccination_status}
                        onChange={(e) => setFormData({...formData, vaccination_status: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">Photo URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.photo_url}
                        onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                        placeholder="https://example.com/dog-photo.jpg"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(dog.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        {dog.photo_url && (
                          <div className="flex-shrink-0">
                            <img
                              src={dog.photo_url}
                              alt={dog.name}
                              className="w-20 h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{dog.name}</h2>
                          <p className="text-gray-600">{dog.breed} • {dog.age} years old • {dog.size}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(dog)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dog.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {dog.temperament && <p className="text-gray-700 mb-2">{dog.temperament}</p>}
                    <p className="text-gray-600">Vaccination: {dog.vaccination_status}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
