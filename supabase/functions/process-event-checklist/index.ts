import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { event_id } = await req.json();

    if (!event_id) {
      return new Response(
        JSON.stringify({ error: 'Event ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get current event status
    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('status')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Only allow status change from 'confirmado' to 'em-andamento'
    if (event.status !== 'confirmado') {
      return new Response(
        JSON.stringify({ error: 'Event must be in confirmed status to start' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Update event status to 'em-andamento'
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({ status: 'em-andamento' })
      .eq('id', event_id);

    if (updateError) {
      console.error('Error updating event status:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update event status' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Update equipment status to 'em-uso' for this event
    const { error: equipmentError } = await supabaseClient
      .from('event_equipment')
      .update({ status: 'em-uso' })
      .eq('event_id', event_id);

    if (equipmentError) {
      console.error('Error updating equipment status:', equipmentError);
      // This is not critical, so we continue
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Event started successfully'
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