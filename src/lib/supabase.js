import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// DATABASE SCHEMA — Run this SQL in Supabase SQL editor
// ============================================================
/*

-- Enable Row Level Security
-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  notify_service BOOLEAN DEFAULT true,
  notify_expiry BOOLEAN DEFAULT true,
  notify_daily_summary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles
CREATE TABLE public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nickname TEXT NOT NULL,
  type TEXT CHECK (type IN ('car', 'bike')) NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  purchase_date DATE,
  fuel_type TEXT CHECK (fuel_type IN ('petrol', 'diesel', 'cng', 'ev')) DEFAULT 'petrol',
  condition TEXT CHECK (condition IN ('new', 'used')) DEFAULT 'new',
  current_odometer NUMERIC DEFAULT 0,
  estimated_mileage NUMERIC,
  -- Oil change info
  last_oil_change_date DATE,
  last_oil_change_km NUMERIC,
  oil_brand TEXT,
  oil_grade TEXT,
  oil_interval_km NUMERIC DEFAULT 5000,
  oil_interval_months INTEGER DEFAULT 6,
  -- Last service info
  last_service_date DATE,
  last_service_km NUMERIC,
  last_service_type TEXT DEFAULT 'general',
  service_interval_km NUMERIC DEFAULT 10000,
  service_interval_months INTEGER DEFAULT 12,
  workshop_name TEXT,
  -- Parts
  air_filter_km NUMERIC,
  air_filter_date DATE,
  chain_km NUMERIC,
  chain_date DATE,
  brake_pads_km NUMERIC,
  tyres_km NUMERIC,
  insurance_expiry DATE,
  puc_expiry DATE,
  battery_date DATE,
  -- Reminders
  remind_before_service_km NUMERIC DEFAULT 500,
  remind_before_expiry_days INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fuel logs
CREATE TABLE public.fuel_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  odometer NUMERIC NOT NULL,
  litres NUMERIC NOT NULL,
  total_cost NUMERIC NOT NULL,
  full_tank BOOLEAN DEFAULT true,
  station_name TEXT,
  mileage NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service logs
CREATE TABLE public.service_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  odometer NUMERIC NOT NULL,
  service_type TEXT NOT NULL,
  parts_changed TEXT[],
  oil_brand TEXT,
  oil_grade TEXT,
  total_cost NUMERIC,
  workshop_name TEXT,
  next_service_date DATE,
  next_service_km NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips
CREATE TABLE public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  from_location TEXT,
  to_location TEXT,
  start_km NUMERIC NOT NULL,
  end_km NUMERIC NOT NULL,
  distance NUMERIC GENERATED ALWAYS AS (end_km - start_km) STORED,
  purpose TEXT CHECK (purpose IN ('personal', 'work', 'travel')) DEFAULT 'personal',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders
CREATE TABLE public.reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  due_date DATE,
  due_km NUMERIC,
  status TEXT CHECK (status IN ('active', 'completed', 'dismissed')) DEFAULT 'active',
  urgency TEXT CHECK (urgency IN ('ok', 'soon', 'overdue')) DEFAULT 'ok',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can CRUD own vehicles" ON public.vehicles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own fuel logs" ON public.fuel_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own service logs" ON public.service_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own trips" ON public.trips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

*/
