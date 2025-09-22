import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Coupon = Database['public']['Tables']['coupons']['Row'];
type CouponInsert = Database['public']['Tables']['coupons']['Insert'];
type CouponUpdate = Database['public']['Tables']['coupons']['Update'];
type CouponUsage = Database['public']['Tables']['coupon_usage']['Row'];

export interface CouponWithUsage extends Coupon {
  usage_count: number;
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalUsage: number;
}

export interface CouponValidationResult {
  valid: boolean;
  discount: number;
  error?: string;
}

export const couponsService = {
  // Get all coupons (admin)
  async getAllCoupons(): Promise<CouponWithUsage[]> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select(`
          *,
          usage_count:coupon_usage(count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching coupons:', error);
        throw new Error(error.message);
      }

      return data?.map(coupon => ({
        ...coupon,
        usage_count: coupon.usage_count?.[0]?.count || 0
      })) || [];
    } catch (error) {
      console.error('Error in getAllCoupons:', error);
      throw error;
    }
  },

  // Get active coupons (public)
  async getActiveCoupons(): Promise<Coupon[]> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active coupons:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveCoupons:', error);
      throw error;
    }
  },

  // Add a new coupon
  async addCoupon(coupon: Omit<CouponInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Coupon> {
    try {
      const now = new Date().toISOString();
      const newCoupon: CouponInsert = {
        ...coupon,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('coupons')
        .insert(newCoupon)
        .select()
        .single();

      if (error) {
        console.error('Error adding coupon:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error in addCoupon:', error);
      throw error;
    }
  },

  // Update an existing coupon
  async updateCoupon(id: string, updates: Partial<CouponUpdate>): Promise<Coupon> {
    try {
      const updateData: CouponUpdate = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('coupons')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating coupon:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error in updateCoupon:', error);
      throw error;
    }
  },

  // Delete a coupon
  async deleteCoupon(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting coupon:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error in deleteCoupon:', error);
      throw error;
    }
  },

  // Get coupon statistics
  async getCouponStats(): Promise<CouponStats> {
    try {
      // Get total coupons
      const { count: totalCoupons, error: totalError } = await supabase
        .from('coupons')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get active coupons
      const { count: activeCoupons, error: activeError } = await supabase
        .from('coupons')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString());

      if (activeError) throw activeError;

      // Get expired coupons
      const { count: expiredCoupons, error: expiredError } = await supabase
        .from('coupons')
        .select('*', { count: 'exact', head: true })
        .lt('expires_at', new Date().toISOString());

      if (expiredError) throw expiredError;

      // Get total usage
      const { count: totalUsage, error: usageError } = await supabase
        .from('coupon_usage')
        .select('*', { count: 'exact', head: true });

      if (usageError) throw usageError;

      return {
        totalCoupons: totalCoupons || 0,
        activeCoupons: activeCoupons || 0,
        expiredCoupons: expiredCoupons || 0,
        totalUsage: totalUsage || 0,
      };
    } catch (error) {
      console.error('Error in getCouponStats:', error);
      throw error;
    }
  },

  // Validate coupon for a user
  async validateCoupon(code: string, userId: string, orderAmount: number): Promise<CouponValidationResult> {
    try {
      // Get coupon details
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (couponError || !coupon) {
        return { valid: false, discount: 0, error: 'Invalid coupon code' };
      }

      // Check if coupon is expired
      if (new Date(coupon.expires_at) < new Date()) {
        return { valid: false, discount: 0, error: 'Coupon has expired' };
      }

      // Check if coupon has reached max usage
      if (coupon.used_count >= coupon.max_usage) {
        return { valid: false, discount: 0, error: 'Coupon usage limit reached' };
      }

      // Check minimum order value
      if (orderAmount < coupon.min_order_value) {
        return { 
          valid: false, 
          discount: 0, 
          error: `Minimum order value of ₹${coupon.min_order_value} required` 
        };
      }

      // Check if user has already used this coupon
      const { data: existingUsage } = await supabase
        .from('coupon_usage')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('user_id', userId)
        .single();

      if (existingUsage) {
        return { valid: false, discount: 0, error: 'You have already used this coupon' };
      }

      // Calculate discount
      let discount = 0;
      if (coupon.type === 'fixed') {
        discount = Math.min(coupon.value, orderAmount);
      } else if (coupon.type === 'percentage') {
        const percentageDiscount = (orderAmount * coupon.value) / 100;
        discount = coupon.max_discount 
          ? Math.min(percentageDiscount, coupon.max_discount)
          : percentageDiscount;
      }

      return { valid: true, discount };
    } catch (error) {
      console.error('Error in validateCoupon:', error);
      return { valid: false, discount: 0, error: 'Error validating coupon' };
    }
  },

  // Apply coupon to order
  async applyCouponToOrder(couponId: string, userId: string, orderId: string, discountAmount: number): Promise<void> {
    try {
      // Record coupon usage
      const { error: usageError } = await supabase
        .from('coupon_usage')
        .insert({
          coupon_id: couponId,
          user_id: userId,
          order_id: orderId,
          discount_amount: discountAmount,
        });

      if (usageError) {
        console.error('Error recording coupon usage:', usageError);
        throw new Error(usageError.message);
      }

      // Update coupon usage count - first get current count, then increment
      const { data: currentCoupon, error: fetchError } = await supabase
        .from('coupons')
        .select('used_count')
        .eq('id', couponId)
        .single();

      if (fetchError) {
        console.error('Error fetching current coupon usage:', fetchError);
        throw new Error(fetchError.message);
      }

      const { error: updateError } = await supabase
        .from('coupons')
        .update({ 
          used_count: (currentCoupon?.used_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', couponId);

      if (updateError) {
        console.error('Error updating coupon usage count:', updateError);
        throw new Error(updateError.message);
      }
    } catch (error) {
      console.error('Error in applyCouponToOrder:', error);
      throw error;
    }
  },

  // Get user's coupon usage history
  async getUserCouponUsage(userId: string): Promise<CouponUsage[]> {
    try {
      const { data, error } = await supabase
        .from('coupon_usage')
        .select(`
          *,
          coupon:coupons(*)
        `)
        .eq('user_id', userId)
        .order('used_at', { ascending: false });

      if (error) {
        console.error('Error fetching user coupon usage:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserCouponUsage:', error);
      throw error;
    }
  },
};

// Helper function to format coupon expiry date for IST
export const formatCouponExpiry = (expiryDate: string): string => {
  const date = new Date(expiryDate);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to check if coupon is expired
export const isCouponExpired = (expiryDate: string): boolean => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return now > expiry;
};
