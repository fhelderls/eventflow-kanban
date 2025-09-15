import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { equipment_id, event_date, event_id } = await req.json();

    if (!equipment_id || !event_date) {
      return new Response(
        JSON.stringify({ error: 'Equipment ID and event date are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Query for equipment conflicts
    let query = supabaseClient
      .from('events')
      .select(`
        id,
        title,
        event_date,
        event_equipment!inner (
          equipment_id,
          status
        )
      `)
      .eq('event_equipment.equipment_id', equipment_id)
      .eq('event_date', event_date)
      .in('status', ['confirmado', 'em-andamento', 'concluido']);

    // Exclude current event if editing
    if (event_id) {
      query = query.neq('id', event_id);
    }

    const { data: conflicts, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to check equipment conflicts' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const hasConflicts = conflicts && conflicts.length > 0;

    return new Response(
      JSON.stringify({
        hasConflicts,
        conflicts: conflicts || []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});