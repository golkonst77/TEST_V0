-- Reviews table creation script for Supabase
-- Execute this in Supabase SQL Editor

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'yandex', 'google', 'website')),
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic updated_at updates
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Allow public read access to published reviews" ON reviews;
CREATE POLICY "Allow public read access to published reviews" 
  ON reviews FOR SELECT 
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow service role full access" ON reviews;
CREATE POLICY "Allow service role full access" 
  ON reviews FOR ALL 
  USING (auth.role() = 'service_role');

-- Insert sample reviews
INSERT INTO reviews (name, company, rating, text, is_published, is_featured, published_at, source) VALUES
  ('Anna Petrova', 'LLC "Stroy-Master"', 5, 'Excellent team! Helped pass tax audit without any fines. Always available, respond quickly and to the point.', TRUE, TRUE, NOW() - INTERVAL '2 months', 'manual'),
  ('Mikhail Sidorov', 'IP Sidorov M.A.', 5, 'Working with ProstoBuro for 3 years. No problems with reporting, everything is submitted on time. Recommend!', TRUE, TRUE, NOW() - INTERVAL '1 month', 'manual'),
  ('Elena Kozlova', 'LLC "Trading House"', 5, 'Professional approach to business. Quickly solve any issues. Reasonable prices, high quality.', TRUE, FALSE, NOW() - INTERVAL '3 weeks', 'manual'),
  ('Dmitry Volkov', 'IP Volkov D.I.', 4, 'Good company, but sometimes there are delays with responses. Overall satisfied with cooperation.', TRUE, FALSE, NOW() - INTERVAL '2 weeks', 'manual'),
  ('Svetlana Ivanova', 'LLC "Innovations"', 5, 'Thank you for professional work! Moved to you from another company and do not regret it. Everything is clear and on time.', TRUE, TRUE, NOW() - INTERVAL '1 week', 'manual'),
  ('Alexey Morozov', 'IP Morozov A.V.', 5, 'Excellent service! Especially like the personal cabinet and ability to track all processes online.', FALSE, FALSE, NULL, 'manual')
ON CONFLICT DO NOTHING;

-- Function to get reviews statistics
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
    COUNT(*)::INTEGER as total_reviews,
    COUNT(CASE WHEN is_published = TRUE THEN 1 END)::INTEGER as published_reviews,
    COUNT(CASE WHEN is_featured = TRUE THEN 1 END)::INTEGER as featured_reviews,
    ROUND(AVG(rating), 2)::DECIMAL(3,2) as average_rating,
    COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)::INTEGER as reviews_this_month
  FROM reviews;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Display table information
SELECT 
  'reviews' as table_name,
  COUNT(*) as row_count,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_count,
  ROUND(AVG(rating), 2) as average_rating
FROM reviews; 