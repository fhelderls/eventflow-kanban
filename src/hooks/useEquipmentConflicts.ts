import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEquipmentConflicts = (equipmentId?: string, eventId?: string, eventDate?: string) => {
  return useQuery({
    queryKey: ["equipmentConflicts", equipmentId, eventId, eventDate],
    queryFn: async () => {
      if (!equipmentId || !eventDate) return [];
      
      // Check for conflicts with other events on the same date
      const { data: conflicts, error } = await supabase
        .from("event_equipment")
        .select(`
          id,
          event_id,
          equipment_id,
          status,
          events!inner(
            id,
            title,
            event_date,
            status
          )
        `)
        .eq("equipment_id", equipmentId)
        .eq("events.event_date", eventDate)
        .neq("event_id", eventId || "")
        .in("status", ["alocado", "em-uso"])
        .in("events.status", ["confirmado", "em-andamento"]);

      if (error) throw error;
      
      return conflicts || [];
    },
    enabled: !!equipmentId && !!eventDate
  });
};

export const useCheckEquipmentAvailability = () => {
  return async (equipmentId: string, eventId: string, eventDate: string): Promise<boolean> => {
    const { data: conflicts } = await supabase
      .from("event_equipment")
      .select(`
        id,
        events!inner(
          id,
          event_date,
          status
        )
      `)
      .eq("equipment_id", equipmentId)
      .eq("events.event_date", eventDate)
      .neq("event_id", eventId)
      .in("status", ["alocado", "em-uso"])
      .in("events.status", ["confirmado", "em-andamento"]);

    return !conflicts || conflicts.length === 0;
  };
};