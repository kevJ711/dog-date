'use client';
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';

interface LikedDogs {
  id: string;
  name: string;
  breed: string;
}
 export default function LikedDogsPage() {
  const [dogs, setDogs] = useState<LikedDogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLikedDogs() {
      // Select all columns from the 'dogs' table where 'liked' is true
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('owner_id', true); // Filter for dogs where the 'liked' column is true

      if (error) {
        console.error('Error fetching liked dogs:', error);
      } else {
        console.log('Liked Dogs appeared', data);
      }
    }

    fetchLikedDogs();
  }, []);

  if (loading) {
    return <div className="container">Loading liked dogs...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>My Liked Dogs</h1>
      {dogs.length > 0 ? (
        <ul className="dog-list">
          {dogs.map((dog) => (
            <li key={dog.id} className="dog-item">
              <h2>{dog.name}</h2>
              <p>Breed: {dog.breed}</p>
              {/* Add more dog details here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No liked dogs found yet.</p>
      )}
    </div>
  );
}
