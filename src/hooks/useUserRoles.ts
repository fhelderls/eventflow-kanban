import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  roles?: Array<{
    role: 'admin' | 'user';
  }>;
}

export const useUserProfiles = () => {
  return useQuery({
    queryKey: ["userProfiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *
        `)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as UserProfile[];
    }
  });
};

export const useCurrentUserRole = () => {
  return useQuery({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return 'user';
      }
      return data?.role || 'user';
    },
    enabled: true
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' }) => {
      // First, remove existing roles
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Then assign new role
      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfiles"] });
      toast({
        title: "Perfil atualizado",
        description: "Função do usuário foi alterada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao alterar função",
        description: "Não foi possível alterar a função do usuário.",
        variant: "destructive",
      });
      console.error("Error assigning role:", error);
    }
  });
};