-- 1. Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    bio TEXT,                     
    location TEXT,                 -- city or neighborhood
    available_times TEXT           
);

-- 2. Dogs table
CREATE TABLE dogs (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sex TEXT,                      -- "Male" or "Female"
    breed TEXT,                     -- can be mixed
    age INT,
    size TEXT,                      -- Small/Medium/Large
    temperament TEXT,                
    vaccination_status TEXT,         -- e.g. "Up-to-date" or missing vaccination
    photo_url TEXT                   -- image URL
);

-- 3. PlaydateRequests table
CREATE TABLE playdate_requests (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
    dog_id INT REFERENCES dogs(id) ON DELETE CASCADE,
    date DATE,
    time TIME,
    location TEXT,
    status TEXT DEFAULT 'pending',   -- pending/accepted/rejected
    created_at TIMESTAMP DEFAULT NOW()  -- current timestamp
);
