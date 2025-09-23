import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  background_image?: string;
  overlay_opacity?: number;
  text_color?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerData {
  title: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  background_image?: string;
  overlay_opacity?: number;
  text_color?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateBannerData extends Partial<CreateBannerData> {
  id: string;
}

export const bannersService = {
  // Get all active banners
  async getActiveBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error("Error fetching active banners:", error);
      throw error;
    }

    return data || [];
  },

  // Get all banners (for admin)
  async getAllBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error("Error fetching all banners:", error);
      throw error;
    }

    return data || [];
  },

  // Create a new banner
  async createBanner(bannerData: CreateBannerData): Promise<Banner> {
    const { data, error } = await supabase
      .from('banners')
      .insert([bannerData])
      .select()
      .single();

    if (error) {
      console.error("Error creating banner:", error);
      throw error;
    }

    return data;
  },

  // Update a banner
  async updateBanner(bannerData: UpdateBannerData): Promise<Banner> {
    const { id, ...updateData } = bannerData;
    
    const { data, error } = await supabase
      .from('banners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating banner:", error);
      throw error;
    }

    return data;
  },

  // Delete a banner
  async deleteBanner(id: string): Promise<void> {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  },

  // Toggle banner active status
  async toggleBannerStatus(id: string, isActive: boolean): Promise<Banner> {
    const { data, error } = await supabase
      .from('banners')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling banner status:", error);
      throw error;
    }

    return data;
  },

  // Update banner display order
  async updateBannerOrder(banners: { id: string; display_order: number }[]): Promise<void> {
    const updates = banners.map(banner => 
      supabase
        .from('banners')
        .update({ display_order: banner.display_order })
        .eq('id', banner.id)
    );

    const results = await Promise.all(updates);
    
    for (const result of results) {
      if (result.error) {
        console.error("Error updating banner order:", result.error);
        throw result.error;
      }
    }
  }
};