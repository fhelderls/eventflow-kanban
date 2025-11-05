import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface EventTask {
  id: string;
  event_id: string;
  description: string;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EventTaskFormData {
  description: string;
  order_index?: number;
}

export const useEventTasks = (eventId?: string) => {
  return useQuery({
    queryKey: ["eventTasks", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from("event_tasks")
        .select("*")
        .eq("event_id", eventId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as EventTask[];
    },
    enabled: !!eventId,
  });
};

export const useCreateEventTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ eventId, data }: { eventId: string; data: EventTaskFormData }) => {
      const { data: result, error } = await supabase
        .from("event_tasks")
        .insert({
          event_id: eventId,
          description: data.description,
          order_index: data.order_index ?? 0,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["eventTasks", eventId] });
      toast({ title: "Tarefa adicionada com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar tarefa",
        variant: "destructive",
      });
    },
  });
};

export const useToggleEventTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ taskId, completed, eventId }: { taskId: string; completed: boolean; eventId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("event_tasks")
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          completed_by: completed ? user?.id : null,
        })
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["eventTasks", eventId] });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar tarefa",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEventTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ taskId, eventId }: { taskId: string; eventId: string }) => {
      const { error } = await supabase
        .from("event_tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["eventTasks", eventId] });
      toast({ title: "Tarefa removida com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao remover tarefa",
        variant: "destructive",
      });
    },
  });
};
