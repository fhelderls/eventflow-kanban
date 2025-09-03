import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Setting {
  id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

export const useSetting = (key: string) => {
  return useQuery({
    queryKey: ["setting", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      return data as Setting | null;
    }
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data, error } = await supabase
        .from("settings")
        .upsert({ key, value })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["setting", data.key] });
      toast({
        title: "Configuração atualizada",
        description: "Configuração foi salva com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar configuração",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive",
      });
      console.error("Error updating setting:", error);
    }
  });
};