"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PlaydateRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  dog_id: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export default function PlaydatesPage() {
  const [playdates, setPlaydates] = useState<PlaydateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaydates();
  }, []);

  const fetchPlaydates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('playdate_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      
      setPlaydates(data || []);
    } catch (err) {
      console.error('Failed to fetch playdates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load playdates');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (playdateId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('playdate_requests')
        .update({ status: newStatus })
        .eq('id', playdateId);

      if (error) {
        throw new Error(error.message);
      }

      // Refresh the list
      fetchPlaydates();
    } catch (err) {
      console.error('Failed to update playdate:', err);
      alert('Failed to update playdate status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Play Dates</h1>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading playdates...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && playdates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No playdates yet. Start browsing dogs to send requests!</p>
          </div>
        )}

        {!loading && !error && playdates.length > 0 && (
          <div className="space-y-4">
            {playdates.map((playdate) => (
              <div key={playdate.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Playdate Request
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Date:</strong> {new Date(playdate.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Time:</strong> {playdate.time}
                    </p>
                    <p className="text-gray-600">
                      <strong>Location:</strong> {playdate.location}
                    </p>
                    <p className="text-gray-600">
                      <strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                        playdate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        playdate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {playdate.status}
                      </span>
                    </p>
                  </div>
                  
                  {playdate.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleStatusUpdate(playdate.id, 'accepted')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(playdate.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
