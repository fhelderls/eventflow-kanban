export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address_cep: string | null
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          company_name: string | null
          contact_person: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          observations: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address_cep?: string | null
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          company_name?: string | null
          contact_person?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          observations?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address_cep?: string | null
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          company_name?: string | null
          contact_person?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          observations?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          acquisition_date: string | null
          category: string | null
          created_at: string
          description: string | null
          equipment_code: string
          id: string
          name: string
          observations: string | null
          status: string
          updated_at: string
          value: number | null
        }
        Insert: {
          acquisition_date?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          equipment_code: string
          id?: string
          name: string
          observations?: string | null
          status?: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          acquisition_date?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          equipment_code?: string
          id?: string
          name?: string
          observations?: string | null
          status?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      event_equipment: {
        Row: {
          allocated_date: string | null
          created_at: string
          equipment_id: string | null
          event_id: string | null
          id: string
          observations: string | null
          quantity: number
          returned_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          allocated_date?: string | null
          created_at?: string
          equipment_id?: string | null
          event_id?: string | null
          id?: string
          observations?: string | null
          quantity?: number
          returned_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          allocated_date?: string | null
          created_at?: string
          equipment_id?: string | null
          event_id?: string | null
          id?: string
          observations?: string | null
          quantity?: number
          returned_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_equipment_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          barrel_quantity: number | null
          client_id: string | null
          created_at: string
          description: string | null
          estimated_budget: number | null
          event_address_cep: string | null
          event_address_city: string | null
          event_address_complement: string | null
          event_address_neighborhood: string | null
          event_address_number: string | null
          event_address_state: string | null
          event_address_street: string | null
          event_date: string
          event_time: string | null
          final_budget: number | null
          id: string
          observations: string | null
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          barrel_quantity?: number | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          estimated_budget?: number | null
          event_address_cep?: string | null
          event_address_city?: string | null
          event_address_complement?: string | null
          event_address_neighborhood?: string | null
          event_address_number?: string | null
          event_address_state?: string | null
          event_address_street?: string | null
          event_date: string
          event_time?: string | null
          final_budget?: number | null
          id?: string
          observations?: string | null
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          barrel_quantity?: number | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          estimated_budget?: number | null
          event_address_cep?: string | null
          event_address_city?: string | null
          event_address_complement?: string | null
          event_address_neighborhood?: string | null
          event_address_number?: string | null
          event_address_state?: string | null
          event_address_street?: string | null
          event_date?: string
          event_time?: string | null
          final_budget?: number | null
          id?: string
          observations?: string | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
