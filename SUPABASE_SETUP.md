# 🐕 Dog Date - Supabase Setup Guide for Team


## 🚀 Setup


### Step 1: Get Supabase Credentials. I'll send it on discord
- Project URL
- Anon Key
- Service Role Key

### Step 2: Install Supabase
   run:
   npm install @supabase/supabase-js


### Step 3: Set Up Environment Variables
1. **CCreate the env file:**
   create a ".env.local" in the root of dog-date folder

2. **Edit `.env.local` with your credentials:**
   ```bash
   # Replace with actual values from discord
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

### ⚠️ **Step 4: Git Ignore Your Env File**
   add ".env.local" to the ".gitignore" file

### Step 5: RUN
   npm run dev

