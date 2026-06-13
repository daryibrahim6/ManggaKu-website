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
      profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          role: 'konsumen' | 'petani' | 'umkm' | 'admin'
          avatar_url: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          role: 'konsumen' | 'petani' | 'umkm' | 'admin'
          avatar_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          role?: 'konsumen' | 'petani' | 'umkm' | 'admin'
          avatar_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      petani_profiles: {
        Row: {
          user_id: string
          store_name: string
          store_slug: string
          location: string | null
          bio: string | null
          rating: number
          total_sales: number
          is_verified_seller: boolean
          verification_status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          user_id: string
          store_name: string
          store_slug: string
          location?: string | null
          bio?: string | null
          rating?: number
          total_sales?: number
          is_verified_seller?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          user_id?: string
          store_name?: string
          store_slug?: string
          location?: string | null
          bio?: string | null
          rating?: number
          total_sales?: number
          is_verified_seller?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
        }
      }
      umkm_profiles: {
        Row: {
          user_id: string
          business_name: string
          business_slug: string
          product_types: string[] | null
          certifications: string[] | null
          location: string | null
          rating: number
          verification_status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          user_id: string
          business_name: string
          business_slug: string
          product_types?: string[] | null
          certifications?: string[] | null
          location?: string | null
          rating?: number
          verification_status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          user_id?: string
          business_name?: string
          business_slug?: string
          product_types?: string[] | null
          certifications?: string[] | null
          location?: string | null
          rating?: number
          verification_status?: 'pending' | 'approved' | 'rejected'
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          recipient_name: string
          phone: string
          street: string
          kelurahan: string | null
          kecamatan: string | null
          kabupaten: string
          provinsi: string
          postal_code: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipient_name: string
          phone: string
          street: string
          kelurahan?: string | null
          kecamatan?: string | null
          kabupaten?: string
          provinsi?: string
          postal_code?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipient_name?: string
          phone?: string
          street?: string
          kelurahan?: string | null
          kecamatan?: string | null
          kabupaten?: string
          provinsi?: string
          postal_code?: string | null
          is_default?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          seller_id: string
          seller_role: 'petani' | 'umkm'
          name: string
          variety: string | null
          category: 'fresh' | 'olahan' | 'bulk'
          description: string | null
          price: number
          unit: string
          stock: number
          min_order: number
          images: string[]
          rating: number
          review_count: number
          status: 'active' | 'inactive' | 'pending_review' | 'rejected'
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          seller_id: string
          seller_role: 'petani' | 'umkm'
          name: string
          variety?: string | null
          category: 'fresh' | 'olahan' | 'bulk'
          description?: string | null
          price: number
          unit: string
          stock?: number
          min_order?: number
          images?: string[]
          rating?: number
          review_count?: number
          status?: 'active' | 'inactive' | 'pending_review' | 'rejected'
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          seller_id?: string
          seller_role?: 'petani' | 'umkm'
          name?: string
          variety?: string | null
          category?: 'fresh' | 'olahan' | 'bulk'
          description?: string | null
          price?: number
          unit?: string
          stock?: number
          min_order?: number
          images?: string[]
          rating?: number
          review_count?: number
          status?: 'active' | 'inactive' | 'pending_review' | 'rejected'
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          buyer_id: string
          status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'disputed'
          payment_method: string | null
          shipping_address: Json
          items: Json
          subtotal: number
          shipping_fee: number
          platform_fee: number
          total: number
          tracking_number: string | null
          courier: string | null
          notes: string | null
          paid_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          buyer_id: string
          status?: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'disputed'
          payment_method?: string | null
          shipping_address: Json
          items: Json
          subtotal: number
          shipping_fee?: number
          platform_fee?: number
          total: number
          tracking_number?: string | null
          courier?: string | null
          notes?: string | null
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          buyer_id?: string
          status?: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'disputed'
          payment_method?: string | null
          shipping_address?: Json
          items?: Json
          subtotal?: number
          shipping_fee?: number
          platform_fee?: number
          total?: number
          tracking_number?: string | null
          courier?: string | null
          notes?: string | null
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          order_id: string
          user_id: string
          rating: number
          comment: string | null
          images: string[]
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          order_id: string
          user_id: string
          rating: number
          comment?: string | null
          images?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          order_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          images?: string[]
          created_at?: string
        }
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
  }
}
