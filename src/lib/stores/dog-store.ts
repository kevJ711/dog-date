import { create } from 'zustand';
import { Dog } from '@/types';

interface DogFilters {
  breed?: string;
  age?: string;
  size?: string;
  distance?: string;
  vaccinated?: boolean;
}

interface DogState {
  dogs: Dog[];
  filteredDogs: Dog[];
  filters: DogFilters;
  selectedDog: Dog | null;
  likedDogs: number[];
  isLoading: boolean;
  
  // Actions
  setDogs: (dogs: Dog[]) => void;
  setFilters: (filters: Partial<DogFilters>) => void;
  clearFilters: () => void;
  setSelectedDog: (dog: Dog | null) => void;
  likeDog: (dogId: number) => void;
  unlikeDog: (dogId: number) => void;
  setLoading: (loading: boolean) => void;
  applyFilters: () => void;
}

const defaultFilters: DogFilters = {
  breed: '',
  age: '',
  size: '',
  distance: '5',
  vaccinated: true,
};

export const useDogStore = create<DogState>((set, get) => ({
  dogs: [],
  filteredDogs: [],
  filters: defaultFilters,
  selectedDog: null,
  likedDogs: [],
  isLoading: false,
  
  setDogs: (dogs: Dog[]) => {
    set({ dogs, filteredDogs: dogs });
  },
  
  setFilters: (newFilters: Partial<DogFilters>) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    set({ filters: updatedFilters });
    get().applyFilters();
  },
  
  clearFilters: () => {
    set({ filters: defaultFilters });
    get().applyFilters();
  },
  
  setSelectedDog: (dog: Dog | null) => {
    set({ selectedDog: dog });
  },
  
  likeDog: (dogId: number) => {
    const { likedDogs } = get();
    if (!likedDogs.includes(dogId)) {
      set({ likedDogs: [...likedDogs, dogId] });
    }
  },
  
  unlikeDog: (dogId: number) => {
    const { likedDogs } = get();
    set({ likedDogs: likedDogs.filter(id => id !== dogId) });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  applyFilters: () => {
    const { dogs, filters } = get();
    let filtered = [...dogs];
    
    if (filters.breed) {
      filtered = filtered.filter(dog => 
        dog.breed.toLowerCase().includes(filters.breed!.toLowerCase())
      );
    }
    
    if (filters.age) {
      const age = parseInt(filters.age);
      filtered = filtered.filter(dog => dog.age === age);
    }
    
    if (filters.size) {
      filtered = filtered.filter(dog => dog.size === filters.size);
    }
    
    if (filters.vaccinated) {
      filtered = filtered.filter(dog => 
        dog.vaccination_status.toLowerCase().includes('up-to-date')
      );
    }
    
    set({ filteredDogs: filtered });
  },
}));

