// Database Types
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  bio?: string;
  location?: string;
  available_times?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Dog {
  id: number;
  owner_id: number;
  name: string;
  sex: 'Male' | 'Female';
  breed: string;
  age: number;
  size: 'Small' | 'Medium' | 'Large';
  temperament?: string;
  vaccination_status: string;
  photo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PlaydateRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  dog_id: number;
  date: Date;
  time: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginForm {
  identifier: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DogForm {
  name: string;
  sex: 'Male' | 'Female';
  breed: string;
  age: number;
  size: 'Small' | 'Medium' | 'Large';
  temperament?: string;
  vaccination_status: string;
  photo_url?: string;
}

export interface PlaydateRequestForm {
  receiver_id: number;
  dog_id: number;
  date: string;
  time: string;
  location: string;
}

// Component Props Types
export interface DogCardProps {
  dog: Dog;
  onRequestPlaydate?: (dogId: number) => void;
  onLike?: (dogId: number) => void;
}

export interface PlaydateCardProps {
  playdate: PlaydateRequest;
  onAccept?: (id: number) => void;
  onDecline?: (id: number) => void;
}

// Utility Types
export type Status = 'pending' | 'accepted' | 'rejected';
export type DogSize = 'Small' | 'Medium' | 'Large';
export type DogSex = 'Male' | 'Female';
