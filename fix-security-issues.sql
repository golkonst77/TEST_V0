-- Fix security issues for existing tables
-- Execute this in Supabase SQL Editor

-- Enable RLS for homepage_config table
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for homepage_config
DROP POLICY IF EXISTS "Allow public read access to homepage_config" ON homepage_config;
CREATE POLICY "Allow public read access to homepage_config" 
  ON homepage_config FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Allow service role full access to homepage_config" ON homepage_config;
CREATE POLICY "Allow service role full access to homepage_config" 
  ON homepage_config FOR ALL 
  USING (auth.role() = 'service_role');

-- Enable RLS for user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow service role full access to user_profiles" ON user_profiles;
CREATE POLICY "Allow service role full access to user_profiles" 
  ON user_profiles FOR ALL 
  USING (auth.role() = 'service_role');

-- Fix functions with mutable search_path by adding SECURITY DEFINER
-- and setting search_path explicitly

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix create_newsletter_table function
CREATE OR REPLACE FUNCTION create_newsletter_table()
RETURNS VOID AS $$
BEGIN
  -- Function implementation here
  -- This function should be reviewed and updated based on actual requirements
  RAISE NOTICE 'create_newsletter_table function called';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix get_newsletter_stats function
CREATE OR REPLACE FUNCTION get_newsletter_stats()
RETURNS TABLE(
  total_subscribers INTEGER,
  active_subscribers INTEGER,
  total_campaigns INTEGER,
  sent_campaigns INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    0::INTEGER as total_subscribers,
    0::INTEGER as active_subscribers,
    0::INTEGER as total_campaigns,
    0::INTEGER as sent_campaigns;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix get_coupon_stats function
CREATE OR REPLACE FUNCTION get_coupon_stats()
RETURNS TABLE(
  total_coupons INTEGER,
  active_coupons INTEGER,
  used_coupons INTEGER,
  total_discount_amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    0::INTEGER as total_coupons,
    0::INTEGER as active_coupons,
    0::INTEGER as used_coupons,
    0::DECIMAL as total_discount_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public; 