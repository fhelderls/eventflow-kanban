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

    // Only allow status change from 'preparacao' to 'montagem'
    if (event.status !== 'preparacao') {
      return new Response(
        JSON.stringify({ error: 'Event must be in preparacao status to start' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify required equipment
    const { data: allocatedEquipment } = await supabaseClient
      .from('event_equipment')
      .select('equipment:equipment_id(category)')
      .eq('event_id', event_id)
      .in('status', ['alocado', 'em-uso']);

    const requiredCategories = ['chopeira', 'cilindro_co2', 'manometro', 'pingadeira', 'extratora'];
    const allocatedCategories = (allocatedEquipment || []).map((e: any) => e.equipment?.category).filter(Boolean);
    const missingCategories = requiredCategories.filter(cat => !allocatedCategories.includes(cat));

    if (missingCategories.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required equipment', missing: missingCategories }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Verify checklist tasks
    const { data: tasks } = await supabaseClient
      .from('event_tasks')
      .select('*')
      .eq('event_id', event_id);

    const incompleteTasks = (tasks || []).filter((t: any) => !t.completed);
    if (incompleteTasks.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Checklist incomplete', incomplete_tasks: incompleteTasks.length }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Update event status to 'montagem'
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({ status: 'montagem' })
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