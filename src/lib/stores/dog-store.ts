import { create } from 'zustand';
import { Dog } from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

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
	likedDogs: string[];
  isLoading: boolean;
  
  // Actions
  setDogs: (dogs: Dog[]) => void;
  setFilters: (filters: Partial<DogFilters>) => void;
  clearFilters: () => void;
  setSelectedDog: (dog: Dog | null) => void;
	likeDog: (dogId: string) => Promise<void>;
	unlikeDog: (dogId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  applyFilters: () => void;
	fetchDogs: () => Promise<void>;
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

	likeDog: async (dogId: string) => {
		const state = get();
		// optimistically update
		if (!state.likedDogs.includes(dogId)) {
			set({ likedDogs: [...state.likedDogs, dogId] });
		}
		try {
			// We need a from_dog_id owned by the user; use selected dog if available
			const fromDogId = state.selectedDog?.id;
			if (!fromDogId) {
				// Revert optimistic update if we cannot determine from_dog_id
				set({ likedDogs: state.likedDogs.filter(id => id !== dogId) });
				throw new Error('No selected dog to like from');
			}
			await fetch(API_ENDPOINTS.LIKES, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ from_dog_id: fromDogId, to_dog_id: dogId })
			});
		} catch (err) {
			// rollback on error
			set({ likedDogs: get().likedDogs.filter(id => id !== dogId) });
			throw err;
		}
	},
	
	unlikeDog: async (dogId: string) => {
		const state = get();
		// optimistically update
		if (state.likedDogs.includes(dogId)) {
			set({ likedDogs: state.likedDogs.filter(id => id !== dogId) });
		}
		try {
			const fromDogId = state.selectedDog?.id;
			if (!fromDogId) {
				throw new Error('No selected dog to unlike from');
			}
			await fetch(API_ENDPOINTS.LIKES, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ from_dog_id: fromDogId, to_dog_id: dogId })
			});
		} catch (err) {
			// rollback on error
			if (!get().likedDogs.includes(dogId)) {
				set({ likedDogs: [...get().likedDogs, dogId] });
			}
			throw err;
		}
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

	fetchDogs: async () => {
		set({ isLoading: true });
		try {
			const res = await fetch(API_ENDPOINTS.DOGS, { method: 'GET' });
			if (!res.ok) {
				throw new Error('Failed to fetch dogs');
			}
			const dogs: Dog[] = await res.json();
			set({ dogs, filteredDogs: dogs });
		} finally {
			set({ isLoading: false });
		}
	},
}));

