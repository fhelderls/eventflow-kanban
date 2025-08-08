import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Equipment {
  id: string;
  equipment_code: string;
  name: string;
  description?: string;
  category?: string;
  status: string;
  acquisition_date?: string;
  value?: number;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentFormData {
  equipment_code: string;
  name: string;
  description?: string;
  category?: string;
  status: string;
  acquisition_date?: string;
  value?: number;
  observations?: string;
}

export const useEquipment = () => {
  return useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Equipment[];
    }
  });
};

export const useAvailableEquipment = () => {
  return useQuery({
    queryKey: ["equipment", "available"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .eq("status", "disponivel")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Equipment[];
    }
  });
};

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (equipmentData: EquipmentFormData) => {
      const { data, error } = await supabase
        .from("equipment")
        .insert(equipmentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast({
        title: "Equipamento criado",
        description: "Equipamento foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar equipamento",
        description: "Não foi possível criar o equipamento.",
        variant: "destructive",
      });
      console.error("Error creating equipment:", error);
    }
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EquipmentFormData> }) => {
      const { data: updatedData, error } = await supabase
        .from("equipment")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
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
      console.error("Error updating equipment:", error);
    }
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("equipment")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast({
        title: "Equipamento excluído",
        description: "Equipamento foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir equipamento",
        description: "Não foi possível excluir o equipamento.",
        variant: "destructive",
      });
      console.error("Error deleting equipment:", error);
    }
  });
};