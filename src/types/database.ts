// Hand-written types mirroring supabase/schema.sql.
// If you prefer generated types, run:
// npx supabase gen types typescript --project-id <ref> > src/types/database.ts

export type OpeningHours = Record<
  string,
  { open: string; close: string } | null
>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  tagline: string | null;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  instagram: string | null;
  price_level: number;
  opening_hours: OpeningHours;
  amenities: string[];
  tags: string[];
  rating: number;
  review_count: number;
  is_published: boolean;
  is_featured: boolean;
  is_curated_favorite: boolean;
  curated_sections: string[];
  created_at: string;
  updated_at: string;
}

export interface BusinessImage {
  id: string;
  business_id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  rating: number;
  review_text: string;
  reviewer_name: string;
  reviewer_photo_url: string | null;
  review_date: string;
  tags: string[];
  is_published: boolean;
  is_seed_content: boolean;
  created_at: string;
}

export interface Offer {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  code: string | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface EventLog {
  id: number;
  event_type: string;
  business_id: string | null;
  category_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface BusinessWithRelations extends Business {
  category: Category | null;
  images: BusinessImage[];
  offers: Offer[];
  reviews?: Review[];
}

/*
 * Supabase database types.
 *
 * IMPORTANT:
 * Insert and Update types intentionally omit database-generated
 * columns such as id, created_at, updated_at, rating, etc.
 */

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      businesses: {
        Row: Business;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id?: string | null;
          tagline?: string | null;
          description?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          whatsapp?: string | null;
          website?: string | null;
          instagram?: string | null;
          price_level?: number;
          opening_hours?: OpeningHours;
          amenities?: string[];
          tags?: string[];
          rating?: number;
          review_count?: number;
          is_published?: boolean;
          is_featured?: boolean;
          is_curated_favorite?: boolean;
          curated_sections?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category_id?: string | null;
          tagline?: string | null;
          description?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          whatsapp?: string | null;
          website?: string | null;
          instagram?: string | null;
          price_level?: number;
          opening_hours?: OpeningHours;
          amenities?: string[];
          tags?: string[];
          rating?: number;
          review_count?: number;
          is_published?: boolean;
          is_featured?: boolean;
          is_curated_favorite?: boolean;
          curated_sections?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };

      business_images: {
        Row: BusinessImage;
        Insert: {
          id?: string;
          business_id: string;
          url: string;
          alt_text?: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          url?: string;
          alt_text?: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };

      reviews: {
        Row: Review;
        Insert: {
          id?: string;
          business_id: string;
          rating: number;
          review_text: string;
          reviewer_name: string;
          reviewer_photo_url?: string | null;
          review_date?: string;
          tags?: string[];
          is_published?: boolean;
          is_seed_content?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          rating?: number;
          review_text?: string;
          reviewer_name?: string;
          reviewer_photo_url?: string | null;
          review_date?: string;
          tags?: string[];
          is_published?: boolean;
          is_seed_content?: boolean;
          created_at?: string;
        };
      };

      offers: {
        Row: Offer;
        Insert: {
          id?: string;
          business_id: string;
          title: string;
          description?: string | null;
          code?: string | null;
          valid_from?: string | null;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          title?: string;
          description?: string | null;
          code?: string | null;
          valid_from?: string | null;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };

      events: {
        Row: EventLog;
        Insert: {
          id?: number;
          event_type: string;
          business_id?: string | null;
          category_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: number;
          event_type?: string;
          business_id?: string | null;
          category_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };

      admin_users: {
        Row: AdminUser;
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
