"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading messages...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No messages yet. Start connecting with other dog owners!</p>
          </div>
        )}

        {!loading && !error && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{message.content}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
