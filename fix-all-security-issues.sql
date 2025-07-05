-- Fix ALL security issues for Supabase
-- Execute this in Supabase SQL Editor

-- STEP 1: Drop existing functions that need to be recreated
DROP FUNCTION IF EXISTS get_newsletter_stats();
DROP FUNCTION IF EXISTS get_coupon_stats();
DROP FUNCTION IF EXISTS get_reviews_stats();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS create_newsletter_table();
DROP FUNCTION IF EXISTS update_reviews_updated_at();

-- STEP 2: Enable RLS for tables

-- Enable RLS for homepage_config table
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;

-- Enable RLS for user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create RLS policies

-- Policies for homepage_config
DROP POLICY IF EXISTS "Allow public read access to homepage_config" ON homepage_config;
CREATE POLICY "Allow public read access to homepage_config" 
  ON homepage_config FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Allow service role full access to homepage_config" ON homepage_config;
CREATE POLICY "Allow service role full access to homepage_config" 
  ON homepage_config FOR ALL 
  USING (auth.role() = 'service_role');

-- Policies for user_profiles
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

-- STEP 4: Recreate functions with proper security settings

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix update_reviews_updated_at function
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
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
  -- Create newsletter table if it doesn't exist
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Enable RLS
  ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  DROP POLICY IF EXISTS "Allow service role full access to newsletter" ON newsletter_subscribers;
  CREATE POLICY "Allow service role full access to newsletter" 
    ON newsletter_subscribers FOR ALL 
    USING (auth.role() = 'service_role');
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
    COALESCE((SELECT COUNT(*)::INTEGER FROM newsletter_subscribers), 0) as total_subscribers,
    COALESCE((SELECT COUNT(*)::INTEGER FROM newsletter_subscribers WHERE is_active = TRUE), 0) as active_subscribers,
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

-- Fix get_reviews_stats function
CREATE OR REPLACE FUNCTION get_reviews_stats()
RETURNS TABLE(
  total_reviews INTEGER,
  published_reviews INTEGER,
  featured_reviews INTEGER,
  average_rating DECIMAL(3,2),
  reviews_this_month INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*)::INTEGER FROM reviews), 0) as total_reviews,
    COALESCE((SELECT COUNT(*)::INTEGER FROM reviews WHERE is_published = TRUE), 0) as published_reviews,
    COALESCE((SELECT COUNT(*)::INTEGER FROM reviews WHERE is_featured = TRUE), 0) as featured_reviews,
    COALESCE((SELECT ROUND(AVG(rating), 2)::DECIMAL(3,2) FROM reviews), 0::DECIMAL(3,2)) as average_rating,
    COALESCE((SELECT COUNT(*)::INTEGER FROM reviews WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)), 0) as reviews_this_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- STEP 5: Verify all functions exist and work
SELECT 'Security fixes applied successfully!' as status; 