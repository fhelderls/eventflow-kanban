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
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          client:clients(id, name, email, phone),
          equipment:event_equipment(
            id,
            quantity,
            status,
            equipment:equipment_id(id, name, equipment_code)
          )
        `)
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    }
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (eventData: EventFormData) => {
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select(`
          *,
          client:clients(id, name, email, phone)
        `)
        .single();

      if (error) throw error;
      return data as Event;
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
      const { data: updatedData, error } = await supabase
        .from("events")
        .update(data)
        .eq("id", id)
        .select(`
          *,
          client:clients(id, name, email, phone)
        `)
        .single();

      if (error) throw error;
      return updatedData as Event;
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