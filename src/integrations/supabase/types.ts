export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "House of Representatives Candidates": {
        Row: {
          ballotGivenName: string | null
          ballotPosition: string | null
          electorate: string | null
          email: string | null
          partyBallotName: string | null
          state: string | null
          surname: string | null
        }
        Insert: {
          ballotGivenName?: string | null
          ballotPosition?: string | null
          electorate?: string | null
          email?: string | null
          partyBallotName?: string | null
          state?: string | null
          surname?: string | null
        }
        Update: {
          ballotGivenName?: string | null
          ballotPosition?: string | null
          electorate?: string | null
          email?: string | null
          partyBallotName?: string | null
          state?: string | null
          surname?: string | null
        }
        Relationships: []
      }
      letter_generation_logs: {
        Row: {
          chamber_type: string
          concern_topic: string | null
          electorate: string
          id: string
          num_candidates: number
          stance: string | null
          timestamp: string
          tone: string | null
        }
        Insert: {
          chamber_type: string
          concern_topic?: string | null
          electorate: string
          id?: string
          num_candidates: number
          stance?: string | null
          timestamp?: string
          tone?: string | null
        }
        Update: {
          chamber_type?: string
          concern_topic?: string | null
          electorate?: string
          id?: string
          num_candidates?: number
          stance?: string | null
          timestamp?: string
          tone?: string | null
        }
        Relationships: []
      }
      letter_submissions: {
        Row: {
          concern: string
          created_at: string | null
          document_insights: string | null
          id: string
          personal_experience: string | null
          policy_ideas: string | null
          sender_email: string | null
          sender_name: string | null
          sender_phone: string | null
          stance: string | null
          tone: string | null
          uploaded_content: string | null
        }
        Insert: {
          concern: string
          created_at?: string | null
          document_insights?: string | null
          id?: string
          personal_experience?: string | null
          policy_ideas?: string | null
          sender_email?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          stance?: string | null
          tone?: string | null
          uploaded_content?: string | null
        }
        Update: {
          concern?: string
          created_at?: string | null
          document_insights?: string | null
          id?: string
          personal_experience?: string | null
          policy_ideas?: string | null
          sender_email?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          stance?: string | null
          tone?: string | null
          uploaded_content?: string | null
        }
        Relationships: []
      }
      postcode_mappings: {
        Row: {
          electorate: string
          locality: string | null
          postcode: number
          state: string
        }
        Insert: {
          electorate: string
          locality?: string | null
          postcode: number
          state: string
        }
        Update: {
          electorate?: string
          locality?: string | null
          postcode?: number
          state?: string
        }
        Relationships: []
      }
      "Senate Candidates": {
        Row: {
          ballotGivenName: string | null
          ballotPosition: string | null
          column: string | null
          email: string | null
          groupName: string | null
          partyBallotName: string | null
          state: string | null
          surname: string | null
        }
        Insert: {
          ballotGivenName?: string | null
          ballotPosition?: string | null
          column?: string | null
          email?: string | null
          groupName?: string | null
          partyBallotName?: string | null
          state?: string | null
          surname?: string | null
        }
        Update: {
          ballotGivenName?: string | null
          ballotPosition?: string | null
          column?: string | null
          email?: string | null
          groupName?: string | null
          partyBallotName?: string | null
          state?: string | null
          surname?: string | null
        }
        Relationships: []
      }
      sent_letters: {
        Row: {
          candidate_chamber: string | null
          candidate_email: string
          candidate_id: string
          candidate_name: string
          candidate_party: string | null
          id: string
          letter_content: string
          sent_at: string | null
          submission_id: string | null
        }
        Insert: {
          candidate_chamber?: string | null
          candidate_email: string
          candidate_id: string
          candidate_name: string
          candidate_party?: string | null
          id?: string
          letter_content: string
          sent_at?: string | null
          submission_id?: string | null
        }
        Update: {
          candidate_chamber?: string | null
          candidate_email?: string
          candidate_id?: string
          candidate_name?: string
          candidate_party?: string | null
          id?: string
          letter_content?: string
          sent_at?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sent_letters_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "letter_submissions"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
