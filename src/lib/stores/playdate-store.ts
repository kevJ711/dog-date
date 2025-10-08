import { create } from 'zustand';
import { PlaydateRequest } from '@/types';

type PlaydateStatus = 'pending' | 'accepted' | 'rejected';
type PlaydateType = 'sent' | 'received';

interface PlaydateWithType extends PlaydateRequest {
  type: PlaydateType;
  dogName: string;
  ownerName: string;
}

interface PlaydateState {
  playdates: PlaydateWithType[];
  filteredPlaydates: PlaydateWithType[];
  selectedStatus: PlaydateStatus | 'all';
  isLoading: boolean;
  
  // Actions
  setPlaydates: (playdates: PlaydateWithType[]) => void;
  setStatusFilter: (status: PlaydateStatus | 'all') => void;
  updatePlaydateStatus: (id: number, status: PlaydateStatus) => void;
  addPlaydate: (playdate: PlaydateWithType) => void;
  setLoading: (loading: boolean) => void;
  applyFilters: () => void;
}

export const usePlaydateStore = create<PlaydateState>((set, get) => ({
  playdates: [],
  filteredPlaydates: [],
  selectedStatus: 'all',
  isLoading: false,
  
  setPlaydates: (playdates: PlaydateWithType[]) => {
    set({ playdates, filteredPlaydates: playdates });
  },
  
  setStatusFilter: (status: PlaydateStatus | 'all') => {
    set({ selectedStatus: status });
    get().applyFilters();
  },
  
  updatePlaydateStatus: (id: number, status: PlaydateStatus) => {
    const { playdates } = get();
    const updatedPlaydates = playdates.map(playdate =>
      playdate.id === id ? { ...playdate, status } : playdate
    );
    set({ playdates: updatedPlaydates });
    get().applyFilters();
  },
  
  addPlaydate: (playdate: PlaydateWithType) => {
    const { playdates } = get();
    set({ playdates: [...playdates, playdate] });
    get().applyFilters();
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  applyFilters: () => {
    const { playdates, selectedStatus } = get();
    let filtered = [...playdates];
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(playdate => playdate.status === selectedStatus);
    }
    
    set({ filteredPlaydates: filtered });
  },
}));

