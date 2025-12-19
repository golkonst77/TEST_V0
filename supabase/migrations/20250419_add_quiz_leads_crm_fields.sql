-- Migration: Add CRM-ready fields to quiz_leads
-- Target: Supabase production (safe to run multiple times)
-- Adds new columns for structured lead data while preserving existing quiz_data JSONB

-- Add site column (source identifier)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'site') THEN
        ALTER TABLE quiz_leads ADD COLUMN site TEXT;
    END IF;
END $$;

-- Add email column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'email') THEN
        ALTER TABLE quiz_leads ADD COLUMN email TEXT;
    END IF;
END $$;

-- Add phone column (nullable)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'phone') THEN
        ALTER TABLE quiz_leads ADD COLUMN phone TEXT;
    END IF;
END $$;

-- Add tax_regime column (nullable)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'tax_regime') THEN
        ALTER TABLE quiz_leads ADD COLUMN tax_regime TEXT;
    END IF;
END $$;

-- Add monthly_revenue column (nullable, integer in rubles)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'monthly_revenue') THEN
        ALTER TABLE quiz_leads ADD COLUMN monthly_revenue INTEGER;
    END IF;
END $$;

-- Add employees_count column (nullable)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'employees_count') THEN
        ALTER TABLE quiz_leads ADD COLUMN employees_count INTEGER;
    END IF;
END $$;

-- Add city column (nullable)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'city') THEN
        ALTER TABLE quiz_leads ADD COLUMN city TEXT;
    END IF;
END $$;

-- Add source column (auto-generated from site: main_site / ausn_site)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'source') THEN
        ALTER TABLE quiz_leads ADD COLUMN source TEXT;
    END IF;
END $$;

-- Add UTM columns (all nullable)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'utm_source') THEN
        ALTER TABLE quiz_leads ADD COLUMN utm_source TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'utm_medium') THEN
        ALTER TABLE quiz_leads ADD COLUMN utm_medium TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'utm_campaign') THEN
        ALTER TABLE quiz_leads ADD COLUMN utm_campaign TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'utm_content') THEN
        ALTER TABLE quiz_leads ADD COLUMN utm_content TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'utm_term') THEN
        ALTER TABLE quiz_leads ADD COLUMN utm_term TEXT;
    END IF;
END $$;

-- Add raw_quiz_answers JSONB column (nullable, full original quizData)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'quiz_leads' AND column_name = 'raw_quiz_answers') THEN
        ALTER TABLE quiz_leads ADD COLUMN raw_quiz_answers JSONB;
    END IF;
END $$;

-- Optional: Add index on site for faster filtering
CREATE INDEX IF NOT EXISTS idx_quiz_leads_site ON quiz_leads(site);

-- Optional: Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_quiz_leads_email ON quiz_leads(email);

-- Optional: Add index on source for CRM filtering
CREATE INDEX IF NOT EXISTS idx_quiz_leads_source ON quiz_leads(source);

-- Optional: Add GIN index on raw_quiz_answers for JSON queries
CREATE INDEX IF NOT EXISTS idx_quiz_leads_raw_quiz_answers_gin ON quiz_leads USING GIN(raw_quiz_answers);

COMMENT ON TABLE quiz_leads IS 'Quiz leads with CRM-ready structured fields and raw quiz data';
COMMENT ON COLUMN quiz_leads.site IS 'Source site identifier: "main", "ausn", etc.';
COMMENT ON COLUMN quiz_leads.email IS 'Lead email address';
COMMENT ON COLUMN quiz_leads.phone IS 'Lead phone number (nullable)';
COMMENT ON COLUMN quiz_leads.tax_regime IS 'Tax regime code (nullable)';
COMMENT ON COLUMN quiz_leads.monthly_revenue IS 'Monthly revenue in rubles (nullable)';
COMMENT ON COLUMN quiz_leads.employees_count IS 'Number of employees (nullable)';
COMMENT ON COLUMN quiz_leads.city IS 'City (nullable)';
COMMENT ON COLUMN quiz_leads.source IS 'Auto-generated source: "main_site", "ausn_site", etc.';
COMMENT ON COLUMN quiz_leads.utm_source IS 'UTM source parameter (nullable)';
COMMENT ON COLUMN quiz_leads.utm_medium IS 'UTM medium parameter (nullable)';
COMMENT ON COLUMN quiz_leads.utm_campaign IS 'UTM campaign parameter (nullable)';
COMMENT ON COLUMN quiz_leads.utm_content IS 'UTM content parameter (nullable)';
COMMENT ON COLUMN quiz_leads.utm_term IS 'UTM term parameter (nullable)';
COMMENT ON COLUMN quiz_leads.raw_quiz_answers IS 'Full original quizData payload as JSONB (nullable)';
