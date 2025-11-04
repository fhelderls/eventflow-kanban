import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  title: string;
  description?: string;
  client_id?: string;
  client?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  event_date: string;
  event_time?: string;
  event_address_street?: string;
  event_address_number?: string;
  event_address_complement?: string;
  event_address_neighborhood?: string;
  event_address_city?: string;
  event_address_state?: string;
  event_address_cep?: string;
  barrel_quantity?: number;
  estimated_budget?: number;
  final_budget?: number;
  status: "planejado" | "confirmado" | "em-andamento" | "concluido" | "cancelado";
  priority: "baixa" | "media" | "alta";
  observations?: string;
  created_at: string;
  updated_at: string;
  equipment?: Array<{
    id: string;
    equipment: {
      id: string;
      name: string;
      equipment_code: string;
    };
    quantity: number;
    status: string;
  }>;
}

export interface EventFormData {
  title: string;
  description?: string;
  client_id?: string;
  event_date: string;
  event_time?: string;
  event_address_street?: string;
  event_address_number?: string;
  event_address_complement?: string;
  event_address_neighborhood?: string;
  event_address_city?: string;
  event_address_state?: string;
  event_address_cep?: string;
  barrel_quantity?: number;
  estimated_budget?: number;
  final_budget?: number;
  status: "planejado" | "confirmado" | "em-andamento" | "concluido" | "cancelado";
  priority: "baixa" | "media" | "alta";
  observations?: string;
}

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      // Buscar eventos simples sem join
      const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
       
      if (error) throw error;
      
      // Buscar dados do cliente e equipamentos separadamente
      const eventsWithDetails = await Promise.all(
        events.map(async (event) => {
          // Buscar cliente se existe client_id
          let client = null;
          if (event.client_id) {
            const { data: clientData } = await supabase
              .from("clients")
              .select("id, name, email, phone")
              .eq("id", event.client_id)
              .single();
            client = clientData;
          }
          
          // Buscar equipamentos do evento
          const { data: equipment } = await supabase
            .from("event_equipment")
            .select("id, quantity, status, equipment_id")
            .eq("event_id", event.id);
            
          const equipmentWithDetails = await Promise.all(
            (equipment || []).map(async (eq) => {
              const { data: equipmentDetail } = await supabase
                .from("equipment")
                .select("id, name, equipment_code")
                .eq("id", eq.equipment_id)
                .single();
              
              return {
                ...eq,
                equipment: equipmentDetail || { id: eq.equipment_id, name: "N/A", equipment_code: "N/A" }
              };
            })
          );
          
          return {
            ...event,
            client,
            equipment: equipmentWithDetails
          };
        })
      );
      
      return eventsWithDetails as Event[];
    }
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventData: EventFormData) => {
      // Clean data to ensure empty strings become null for UUIDs
      const cleanedData = {
        ...eventData,
        client_id: eventData.client_id && eventData.client_id.trim() !== "" ? eventData.client_id : null,
      };

      const { data, error } = await supabase
        .from("events")
        .insert(cleanedData)
        .select("*")
        .single();

      if (error) throw error;
      
      // Buscar cliente se existe
      let client = null;
      if (data.client_id) {
        const { data: clientData } = await supabase
          .from("clients")
          .select("id, name, email, phone")
          .eq("id", data.client_id)
          .single();
        client = clientData;
      }
      
      return { ...data, client } as Event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento criado",
        description: "Evento foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar evento",
        description: "Não foi possível criar o evento.",
        variant: "destructive",
      });
      console.error("Error creating event:", error);
    }
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EventFormData> }) => {
      // Clean data to ensure empty strings become null for UUIDs
      const cleanedData = {
        ...data,
        client_id: data.client_id !== undefined && data.client_id?.trim() === "" ? null : data.client_id,
      };

      const { error } = await supabase
        .from("events")
        .update(cleanedData)
        .eq("id", id);

      if (error) throw error;
      
      // Invalidate queries to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["events"] });
      
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento atualizado",
        description: "Evento foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar evento",
        description: "Não foi possível atualizar o evento.",
        variant: "destructive",
      });
      console.error("Error updating event:", error);
    }
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento excluído",
        description: "Evento foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir evento",
        description: "Não foi possível excluir o evento.",
        variant: "destructive",
      });
      console.error("Error deleting event:", error);
    }
  });
};