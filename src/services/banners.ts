import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Banner = Tables<"banners">;
export type BannerInsert = TablesInsert<"banners">;
export type BannerUpdate = TablesUpdate<"banners">;

export const bannersService = {
  // Get all banners (admin only)
  async getAllBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }

    return data || [];
  },

  // Get active banners (public)
  async getActiveBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

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