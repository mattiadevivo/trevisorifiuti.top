export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      [_ in never]: never
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
  tvtrash: {
    Tables: {
      municipalities: {
        Row: {
          area: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          zone: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          zone: string
        }
        Update: {
          area?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          zone?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          municipality_id: string
          notification_info: Json
          notification_type_id: string
          user_id: string
        }
        Insert: {
          municipality_id: string
          notification_info?: Json
          notification_type_id: string
          user_id: string
        }
        Update: {
          municipality_id?: string
          notification_info?: Json
          notification_type_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_notification_type_id_fkey"
            columns: ["notification_type_id"]
            isOneToOne: false
            referencedRelation: "notification_types"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_types: {
        Row: {
          id: string
          info: Json
          name: string
        }
        Insert: {
          id?: string
          info?: Json
          name: string
        }
        Update: {
          id?: string
          info?: Json
          name?: string
        }
        Relationships: []
      }
      waste_collections: {
        Row: {
          created_at: string
          date: string
          id: string
          municipality_id: string
          updated_at: string
          waste: string[]
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          municipality_id: string
          updated_at?: string
          waste: string[]
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          municipality_id?: string
          updated_at?: string
          waste?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "waste_collections_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_schedule_for_date_and_user: {
        Args: { target_date: string; target_user: string }
        Returns: {
          area: string
          collection_date: string
          municipality_id: string
          municipality_name: string
          notification_info: Json
          notification_type_info: Json
          notification_type_name: string
          user_id: string
          waste: string[]
          zone: string
        }[]
      }
      get_schedules_for_date: {
        Args: { target_date: string }
        Returns: {
          area: string
          collection_date: string
          municipality_id: string
          municipality_name: string
          notification_info: Json
          notification_type_info: Json
          notification_type_name: string
          user_id: string
          waste: string[]
          zone: string
        }[]
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  tvtrash: {
    Enums: {},
  },
} as const

