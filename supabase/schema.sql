-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  google_access_token TEXT,
  google_refresh_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  location TEXT,
  notes TEXT,
  reminder_time TIMESTAMPTZ,
  google_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fetching a user's appointments quickly
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
