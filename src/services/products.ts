import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface AdminProduct extends Product {
  // Additional admin-specific fields if needed
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  categories: number;
  newProducts: number;
}

export const productsService = {
  // Fetch all products
  async getAllProducts(): Promise<AdminProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  },

  // Fetch active products only (for public display)
  async getActiveProducts(): Promise<AdminProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active products:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveProducts:', error);
      throw error;
    }
  },

  // Add a new product
  async addProduct(product: Omit<ProductInsert, 'id' | 'created_at' | 'updated_at'>): Promise<AdminProduct> {
    try {
      const now = new Date().toISOString();
      const newProduct: ProductInsert = {
        ...product,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(newProduct)
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error in addProduct:', error);
      throw error;
    }
  },

  // Update an existing product
  async updateProduct(id: string, updates: Partial<ProductUpdate>): Promise<AdminProduct> {
    try {
      const updateData: ProductUpdate = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  // Delete a product
  async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },

  // Get product statistics
  async getProductStats(): Promise<ProductStats> {
    try {
      // Get total products
      const { count: totalProducts, error: totalError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get active products
      const { count: activeProducts, error: activeError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) throw activeError;

      // Get new products
      const { count: newProducts, error: newError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_new', true);

      if (newError) throw newError;

      // Get unique categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('products')
        .select('category');

      if (categoriesError) throw categoriesError;

      const categories = new Set(categoriesData?.map(p => p.category) || []).size;

      return {
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        categories,
        newProducts: newProducts || 0,
      };
    } catch (error) {
      console.error('Error in getProductStats:', error);
      throw error;
    }
  },
};

// Helper function to convert database product to frontend product format
export const convertToFrontendProduct = (dbProduct: Product): AdminProduct => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    original_price: dbProduct.original_price,
    image: dbProduct.image || [],
    category: dbProduct.category,
    description: dbProduct.description,
    features: dbProduct.features || [],
    rating: dbProduct.rating,
    reviews: dbProduct.reviews,
    is_new: dbProduct.is_new,
    stock: dbProduct.stock,
    is_active: dbProduct.is_active,
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at
  };
};

// Helper function to convert frontend product to database format
export const convertToDatabaseProduct = (frontendProduct: any): Omit<ProductInsert, 'id' | 'created_at' | 'updated_at'> => {
  return {
    name: frontendProduct.name,
    price: frontendProduct.price,
    original_price: frontendProduct.originalPrice,
    image: Array.isArray(frontendProduct.images) ? frontendProduct.images : 
           (frontendProduct.images ? [frontendProduct.images] : []),
    category: frontendProduct.category,
    description: frontendProduct.description,
    features: frontendProduct.features || [],
    rating: frontendProduct.rating || 5,
    reviews: frontendProduct.reviews || 0,
    is_new: frontendProduct.isNew || false,
    stock: frontendProduct.stock || 0,
    is_active: frontendProduct.isActive !== undefined ? frontendProduct.isActive : true
  };
};
