export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string;
          body: string;
          category: string;
          cover_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          kind: string;
          pinned: boolean;
          published: boolean;
          published_at: string;
          read_minutes: number;
          slug: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          author?: string;
          body?: string;
          category?: string;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          kind?: string;
          pinned?: boolean;
          published?: boolean;
          published_at?: string;
          read_minutes?: number;
          slug: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string;
          body?: string;
          category?: string;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          kind?: string;
          pinned?: boolean;
          published?: boolean;
          published_at?: string;
          read_minutes?: number;
          slug?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      auth_email_requests: {
        Row: {
          email_hash: string;
          flow: string;
          requested_at: string;
        };
        Insert: {
          email_hash: string;
          flow: string;
          requested_at?: string;
        };
        Update: {
          email_hash?: string;
          flow?: string;
          requested_at?: string;
        };
        Relationships: [];
      };
      enquiries: {
        Row: {
          assigned_to: string | null;
          company: string | null;
          created_at: string;
          email: string;
          follow_up_at: string | null;
          id: string;
          internal_notes: string;
          message: string;
          name: string;
          phone: string | null;
          priority: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          company?: string | null;
          created_at?: string;
          email: string;
          follow_up_at?: string | null;
          id?: string;
          internal_notes?: string;
          message: string;
          name: string;
          phone?: string | null;
          priority?: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string;
          follow_up_at?: string | null;
          id?: string;
          internal_notes?: string;
          message?: string;
          name?: string;
          phone?: string | null;
          priority?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enquiries_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      enquiry_rate_limits: {
        Row: {
          fingerprint_hash: string;
          request_count: number;
          window_started_at: string;
        };
        Insert: {
          fingerprint_hash: string;
          request_count?: number;
          window_started_at?: string;
        };
        Update: {
          fingerprint_hash?: string;
          request_count?: number;
          window_started_at?: string;
        };
        Relationships: [];
      };
      exhibitions: {
        Row: {
          created_at: string;
          date_label: string;
          id: string;
          image_url: string | null;
          location: string;
          published: boolean;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          date_label?: string;
          id?: string;
          image_url?: string | null;
          location?: string;
          published?: boolean;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          date_label?: string;
          id?: string;
          image_url?: string | null;
          location?: string;
          published?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      news_items: {
        Row: {
          body: string;
          category: string;
          created_at: string;
          date_label: string;
          excerpt: string;
          id: string;
          image_url: string | null;
          published: boolean;
          sort_order: number;
          tag: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string;
          category?: string;
          created_at?: string;
          date_label?: string;
          excerpt?: string;
          id?: string;
          image_url?: string | null;
          published?: boolean;
          sort_order?: number;
          tag?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          category?: string;
          created_at?: string;
          date_label?: string;
          excerpt?: string;
          id?: string;
          image_url?: string | null;
          published?: boolean;
          sort_order?: number;
          tag?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          applications: string[];
          category: string;
          code: string;
          created_at: string;
          description: string;
          gallery_images: string[];
          highlights: string[];
          id: string;
          image_url: string | null;
          published: boolean;
          section: string;
          slug: string;
          sort_order: number;
          specs: Json;
          tagline: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          applications?: string[];
          category?: string;
          code: string;
          created_at?: string;
          description?: string;
          gallery_images?: string[];
          highlights?: string[];
          id?: string;
          image_url?: string | null;
          published?: boolean;
          section?: string;
          slug: string;
          sort_order?: number;
          specs?: Json;
          tagline?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          applications?: string[];
          category?: string;
          code?: string;
          created_at?: string;
          description?: string;
          gallery_images?: string[];
          highlights?: string[];
          id?: string;
          image_url?: string | null;
          published?: boolean;
          section?: string;
          slug?: string;
          sort_order?: number;
          specs?: Json;
          tagline?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          active: boolean;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      lead_activities: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          details: Json;
          enquiry_id: string;
          id: string;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          details?: Json;
          enquiry_id: string;
          id?: string;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          details?: Json;
          enquiry_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lead_activities_enquiry_id_fkey";
            columns: ["enquiry_id"];
            isOneToOne: false;
            referencedRelation: "enquiries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lead_activities_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: string;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: string;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_admin: { Args: never; Returns: boolean };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      has_role_name: {
        Args: { _role: string; _user_id: string };
        Returns: boolean;
      };
      reserve_auth_email_request: {
        Args: {
          _email_hash: string;
          _flow: string;
          _minimum_interval_seconds?: number;
        };
        Returns: boolean;
      };
      reserve_enquiry_request: {
        Args: {
          _fingerprint_hash: string;
          _maximum_requests?: number;
          _window_seconds?: number;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "editor" | "sales_manager" | "sales";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "sales_manager", "sales"],
    },
  },
} as const;
