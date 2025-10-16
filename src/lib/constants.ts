// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
  },
  USERS: '/api/users',
  DOGS: '/api/dog',
  MESSAGES: '/api/messages',
  LIKES: '/api/likes',
  PLAYDATES: '/api/playdates',
  IMAGES: '/api/images',
} as const;

// App Constants
export const APP_CONFIG = {
  NAME: 'Dog Date',
  DESCRIPTION: 'Find play dates for your furry friend',
  VERSION: '1.0.0',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// Database Constants
export const DB_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_BIO_LENGTH: 500,
    MAX_MESSAGE_LENGTH: 1000,
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
  ANIMATION: {
    DURATION: 200,
    EASING: 'ease-in-out',
  },
} as const;

// Dog Breeds (Common ones)
export const DOG_BREEDS = [
  'Golden Retriever',
  'Labrador Retriever',
  'German Shepherd',
  'French Bulldog',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'German Shorthaired Pointer',
  'Yorkshire Terrier',
  'Siberian Husky',
  'Dachshund',
  'Boxer',
  'Great Dane',
  'Chihuahua',
  'Shih Tzu',
  'Boston Terrier',
  'Pomeranian',
  'Australian Shepherd',
  'Border Collie',
  'Mixed Breed',
  'Other',
] as const;

// Dog Sizes
export const DOG_SIZES = ['Small', 'Medium', 'Large'] as const;

// Dog Sex
export const DOG_SEX = ['Male', 'Female'] as const;

// Playdate Status
export const PLAYDATE_STATUS = ['pending', 'accepted', 'rejected'] as const;

// Vaccination Status
export const VACCINATION_STATUS = [
  'Up-to-date',
  'Needs shots',
  'Not vaccinated',
] as const;
