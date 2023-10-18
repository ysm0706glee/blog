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
      blog_tags: {
        Row: {
          blog_id: number
          tag_id: number
        }
        Insert: {
          blog_id: number
          tag_id: number
        }
        Update: {
          blog_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_tags_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      blogs: {
        Row: {
          created_at: string
          description: string
          id: number
          image: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          image: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          image?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
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
