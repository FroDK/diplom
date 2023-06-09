export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contest: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          description: string | null
          id: string
          kind_of_contest: string
          status: string
          title: string
          type_contest: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          description?: string | null
          id?: string
          kind_of_contest: string
          status: string
          title: string
          type_contest: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          kind_of_contest?: string
          status?: string
          title?: string
          type_contest?: string
        }
      }
      contest_user: {
        Row: {
          contest_id: string
          user_id: string
        }
        Insert: {
          contest_id: string
          user_id: string
        }
        Update: {
          contest_id?: string
          user_id?: string
        }
      }
      criteria: {
        Row: {
          description: string | null
          form: string
          id: string
          order: number
          title: string
          type: string
        }
        Insert: {
          description?: string | null
          form: string
          id?: string
          order: number
          title: string
          type: string
        }
        Update: {
          description?: string | null
          form?: string
          id?: string
          order?: number
          title?: string
          type?: string
        }
      }
      criteria_answer: {
        Row: {
          criteria: string
          criteria_option: string
          form_answer: string
          id: string
        }
        Insert: {
          criteria: string
          criteria_option: string
          form_answer: string
          id?: string
        }
        Update: {
          criteria?: string
          criteria_option?: string
          form_answer?: string
          id?: string
        }
      }
      criteria_option: {
        Row: {
          criteria: string
          id: string
          value: number
        }
        Insert: {
          criteria: string
          id?: string
          value: number
        }
        Update: {
          criteria?: string
          id?: string
          value?: number
        }
      }
      form: {
        Row: {
          created_at: string
          id: string
          name: string
          owner: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner?: string
        }
      }
      form_answer: {
        Row: {
          form: string | null
          id: string
          team: string
          user: string | null
        }
        Insert: {
          form?: string | null
          id?: string
          team: string
          user?: string | null
        }
        Update: {
          form?: string | null
          id?: string
          team?: string
          user?: string | null
        }
      }
      team: {
        Row: {
          contest: string
          id: string
          name: string
        }
        Insert: {
          contest: string
          id?: string
          name: string
        }
        Update: {
          contest?: string
          id?: string
          name?: string
        }
      }
      team_member: {
        Row: {
          id: string
          is_captain: boolean
          team: string
          user: string
        }
        Insert: {
          id?: string
          is_captain: boolean
          team: string
          user: string
        }
        Update: {
          id?: string
          is_captain?: boolean
          team?: string
          user?: string
        }
      }
      type_contest: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      users: {
        Row: {
          description: string | null
          email: string | null
          fio: string | null
          id: string
          phone: string | null
          qualities: string[] | null
          user_role: string | null
        }
        Insert: {
          description?: string | null
          email?: string | null
          fio?: string | null
          id: string
          phone?: string | null
          qualities?: string[] | null
          user_role?: string | null
        }
        Update: {
          description?: string | null
          email?: string | null
          fio?: string | null
          id?: string
          phone?: string | null
          qualities?: string[] | null
          user_role?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
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

