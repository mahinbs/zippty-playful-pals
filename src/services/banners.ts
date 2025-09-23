import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Banner = Database["public"]["Tables"]["banners"]["Row"];
export type BannerInsert = Database["public"]["Tables"]["banners"]["Insert"];
export type BannerUpdate = Database["public"]["Tables"]["banners"]["Update"];

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  button_text: string;
  button_link: string;
  background_image: string | null;
  overlay_opacity: number;
  text_color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const bannersService = {
  // Get all banners for admin
  async getAllBanners(): Promise<AdminBanner[]> {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }

    return data || [];
  },

  // Get active banners for public display
  async getActiveBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching active banners:", error);
      throw error;
    }

    return data || [];
  },

  // Add new banner
  async addBanner(banner: BannerInsert): Promise<Banner> {
    const { data, error } = await supabase
      .from("banners")
      .insert(banner)
      .select()
      .single();

    if (error) {
      console.error("Error adding banner:", error);
      throw error;
    }

    return data;
  },

  // Update banner
  async updateBanner(id: string, updates: BannerUpdate): Promise<Banner> {
    const { data, error } = await supabase
      .from("banners")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating banner:", error);
      throw error;
    }

    return data;
  },

  // Delete banner
  async deleteBanner(id: string): Promise<void> {
    const { error } = await supabase
      .from("banners")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  },

  // Toggle banner active status
  async toggleBannerStatus(id: string, isActive: boolean): Promise<Banner> {
    return this.updateBanner(id, { is_active: isActive });
  },
};