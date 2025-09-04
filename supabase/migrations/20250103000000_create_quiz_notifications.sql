-- Create quiz_notifications table
CREATE TABLE IF NOT EXISTS public.quiz_notifications (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    error_message TEXT
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_notifications_email ON public.quiz_notifications(email);
CREATE INDEX IF NOT EXISTS idx_quiz_notifications_status ON public.quiz_notifications(status);
CREATE INDEX IF NOT EXISTS idx_quiz_notifications_created_at ON public.quiz_notifications(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.quiz_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage quiz notifications" ON public.quiz_notifications
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON public.quiz_notifications TO service_role;
GRANT USAGE ON SEQUENCE public.quiz_notifications_id_seq TO service_role;
