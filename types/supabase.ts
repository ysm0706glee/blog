export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          created_at: string
          description: string
          id: number
          image: string | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          image?: string | null
          title: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          image?: string | null
          title?: string
          url?: string
        }
        Relationships: []
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
