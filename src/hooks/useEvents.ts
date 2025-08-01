import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface Event {
  id: string;
  title: string;
  description?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  event_date: string;
  event_time: string;
  end_time?: string;
  location: string;
  address?: string;
  status: "planejado" | "confirmado" | "em-andamento" | "concluido" | "cancelado";
  priority: "alta" | "media" | "baixa";
  estimated_budget?: number;
  final_budget?: number;
  notes?: string;
  contract_file_url?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Mock data temporário
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Casamento Silva & Santos",
    client_name: "Maria Silva",
    client_email: "maria@email.com",
    client_phone: "(11) 99999-1111",
    event_date: "2024-12-15",
    event_time: "19:00",
    end_time: "23:00",
    location: "Salão Príncipe",
    address: "Rua das Flores, 123 - Centro",
    status: "confirmado",
    priority: "alta",
    estimated_budget: 5000,
    notes: "Evento especial com decoração temática",
    created_at: "2024-12-01T10:00:00Z"
  },
  {
    id: "2", 
    title: "Formatura Medicina UFMG",
    client_name: "João Oliveira",
    client_email: "joao@email.com",
    event_date: "2024-12-20",
    event_time: "20:00",
    location: "Centro de Convenções",
    status: "planejado",
    priority: "media",
    estimated_budget: 8000,
    created_at: "2024-12-01T11:00:00Z"
  }
];


export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      // Simulação da API - será substituído pelo Supabase real
      return new Promise<Event[]>((resolve) => {
        setTimeout(() => resolve(mockEvents), 500);
      });
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (event: Omit<Event, "id" | "created_at" | "updated_at" | "created_by">) => {
      // Simulação da criação - será substituído pelo Supabase real
      return new Promise<Event>((resolve) => {
        setTimeout(() => {
          const newEvent: Event = {
            ...event,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            created_by: "mock-user",
          };
          mockEvents.push(newEvent);
          resolve(newEvent);
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento criado!",
        description: "O evento foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar evento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...event }: Partial<Event> & { id: string }) => {
      // Simulação da atualização - será substituído pelo Supabase real
      return new Promise<Event>((resolve) => {
        setTimeout(() => {
          const index = mockEvents.findIndex(e => e.id === id);
          if (index !== -1) {
            mockEvents[index] = { ...mockEvents[index], ...event };
            resolve(mockEvents[index]);
          }
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar evento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Simulação da exclusão - será substituído pelo Supabase real
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const index = mockEvents.findIndex(e => e.id === id);
          if (index !== -1) {
            mockEvents.splice(index, 1);
          }
          resolve();
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento excluído!",
        description: "O evento foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};