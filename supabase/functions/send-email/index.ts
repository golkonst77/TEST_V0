import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables')
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Parse request body
    const { to, subject, html, text } = await req.json()
    
    if (!to || !subject) {
      throw new Error('Missing required fields: to, subject')
    }

    // For now, we'll use a simple approach - store in database
    // In production, you might want to integrate with a real email service
    const { data, error } = await supabase
      .from('quiz_notifications')
      .insert([
        {
          email: to,
          subject: subject,
          content: text || html,
          status: 'sent',
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      throw error
    }

    // Log the notification
    console.log(`Email notification logged for ${to}: ${subject}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email notification logged successfully',
        data: data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in send-email function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
