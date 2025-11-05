import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCheckEquipmentAvailability } from "./useEquipmentConflicts";

export interface EventEquipment {
  id: string;
  event_id: string;
  equipment_id: string;
  quantity: number;
  status: string;
  allocated_date?: string;
  returned_date?: string;
  observations?: string;
  equipment?: {
    id: string;
    name: string;
    equipment_code: string;
    category?: string;
  };
}

export interface EventEquipmentFormData {
  equipment_id: string;
  quantity: number;
  status: string;
  observations?: string;
}

export const useEventEquipment = (eventId?: string) => {
  return useQuery({
    queryKey: ["eventEquipment", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from("event_equipment")
        .select("*")
        .eq("event_id", eventId)
        .order("allocated_date", { ascending: true });

      if (error) throw error;
      
      // Fetch equipment details separately
      const equipmentWithDetails = await Promise.all(
        (data || []).map(async (item) => {
          const { data: equipmentDetail } = await supabase
            .from("equipment")
            .select("id, name, equipment_code, category")
            .eq("id", item.equipment_id)
            .single();
          
          return {
            ...item,
            equipment: equipmentDetail || { id: item.equipment_id, name: "N/A", equipment_code: "N/A" }
          };
        })
      );
      
      return equipmentWithDetails as EventEquipment[];
    },
    enabled: !!eventId
  });
};

export const useAddEventEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const checkAvailability = useCheckEquipmentAvailability();

  return useMutation({
    mutationFn: async ({ eventId, equipmentData, eventDate }: { 
      eventId: string; 
      equipmentData: EventEquipmentFormData;
      eventDate: string;
    }) => {
      // Check if equipment is available for this date
      const isAvailable = await checkAvailability(
        equipmentData.equipment_id,
        eventId,
        eventDate
      );

      if (!isAvailable) {
        throw new Error("Este equipamento já está alocado para outro evento na mesma data.");
      }

      const { data, error } = await supabase
        .from("event_equipment")
        .insert({
          event_id: eventId,
          ...equipmentData
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["eventEquipment", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Equipamento adicionado",
        description: "Equipamento foi adicionado ao evento com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar equipamento",
        description: error.message || "Não foi possível adicionar o equipamento.",
        variant: "destructive",
      });
      console.error("Error adding event equipment:", error);
    }
  });
};

export const useUpdateEventEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, eventId, data }: { id: string; eventId: string; data: Partial<EventEquipmentFormData> }) => {
      const { data: updatedData, error } = await supabase
        .from("event_equipment")
        .update(data)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["eventEquipment", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Equipamento atualizado",
        description: "Equipamento foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar equipamento",
        description: "Não foi possível atualizar o equipamento.",
        variant: "destructive",
      });
      console.error("Error updating event equipment:", error);
    }
  });
};

export const useRemoveEventEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
      const { error } = await supabase
        .from("event_equipment")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["eventEquipment", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Equipamento removido",
        description: "Equipamento foi removido do evento.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover equipamento",
        description: "Não foi possível remover o equipamento.",
        variant: "destructive",
      });
      console.error("Error removing event equipment:", error);
    }
  });
};