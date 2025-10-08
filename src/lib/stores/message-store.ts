import { create } from 'zustand';
import { Message } from '@/types';

interface Conversation {
  id: number;
  dogName: string;
  ownerName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

interface MessageState {
  conversations: Conversation[];
  activeConversation: number | null;
  messages: Message[];
  isLoading: boolean;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversationId: number | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  markAsRead: (conversationId: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  
  setConversations: (conversations: Conversation[]) => {
    set({ conversations });
  },
  
  setActiveConversation: (conversationId: number | null) => {
    set({ activeConversation: conversationId });
  },
  
  setMessages: (messages: Message[]) => {
    set({ messages });
  },
  
  addMessage: (message: Message) => {
    const { messages } = get();
    set({ messages: [...messages, message] });
  },
  
  markAsRead: (conversationId: number) => {
    const { conversations } = get();
    const updatedConversations = conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unread: 0 }
        : conv
    );
    set({ conversations: updatedConversations });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

