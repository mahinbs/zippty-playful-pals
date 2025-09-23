import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Edit, Trash2, Copy, Eye, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { couponsService, CouponWithUsage, CouponStats, formatCouponExpiry, isCouponExpired } from '@/services/coupons';
import { toast } from 'sonner';

interface CouponFormData {
  code: string;
  name: string;
  description: string;
  type: 'fixed' | 'percentage';
  value: number;
  max_discount?: number;
  min_order_value: number;
  max_usage: number;
  is_active: boolean;
  expires_at: Date;
}

const AdminCouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponWithUsage[]>([]);
  const [stats, setStats] = useState<CouponStats>({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalUsage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponWithUsage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<CouponWithUsage | null>(null);

  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    name: '',
    description: '',
    type: 'fixed',
    value: 0,
    max_discount: undefined,
    min_order_value: 0,
    max_usage: 1,
    is_active: true,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });

  // Load data on component mount
  useEffect(() => {
    loadCoupons();
    loadStats();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponsService.getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await couponsService.getCouponStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'fixed',
      value: 0,
      max_discount: undefined,
      min_order_value: 0,
      max_usage: 1,
      is_active: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  };

  const handleAddCoupon = async () => {
    if (!formData.code || !formData.name || formData.value <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await couponsService.addCoupon({
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        value: formData.value,
        max_discount: formData.max_discount || null,
        min_order_value: formData.min_order_value,
        max_usage: formData.max_usage,
        is_active: formData.is_active,
        expires_at: formData.expires_at.toISOString(),
      });

      toast.success('Coupon created successfully');
      setIsAddDialogOpen(false);
      resetForm();
      loadCoupons();
      loadStats();
    } catch (error) {
      console.error('Error adding coupon:', error);
      toast.error('Failed to create coupon');
    }
  };

  const handleEditCoupon = async () => {
    if (!editingCoupon || !formData.code || !formData.name || formData.value <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await couponsService.updateCoupon(editingCoupon.id, {
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        value: formData.value,
        max_discount: formData.max_discount || null,
        min_order_value: formData.min_order_value,
        max_usage: formData.max_usage,
        is_active: formData.is_active,
        expires_at: formData.expires_at.toISOString(),
      });

      toast.success('Coupon updated successfully');
      setIsEditDialogOpen(false);
      setEditingCoupon(null);
      resetForm();
      loadCoupons();
      loadStats();
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Failed to update coupon');
    }
  };

  const handleDeleteCoupon = async () => {
    if (!couponToDelete) return;

    try {
      await couponsService.deleteCoupon(couponToDelete.id);
      toast.success('Coupon deleted successfully');
      setIsDeleteDialogOpen(false);
      setCouponToDelete(null);
      loadCoupons();
      loadStats();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const openEditDialog = (coupon: CouponWithUsage) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      type: coupon.type as 'fixed' | 'percentage',
      value: coupon.value,
      max_discount: coupon.max_discount || undefined,
      min_order_value: coupon.min_order_value,
      max_usage: coupon.max_usage,
      is_active: coupon.is_active,
      expires_at: new Date(coupon.expires_at),
    });
    setIsEditDialogOpen(true);
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard');
  };

  const getCouponStatus = (coupon: CouponWithUsage) => {
    if (!coupon.is_active) return { label: 'Inactive', variant: 'secondary' as const };
    if (isCouponExpired(coupon.expires_at)) return { label: 'Expired', variant: 'destructive' as const };
    if (coupon.used_count >= coupon.max_usage) return { label: 'Fully Used', variant: 'outline' as const };
    return { label: 'Active', variant: 'default' as const };
  };

  const getCouponStatusIcon = (coupon: CouponWithUsage) => {
    if (!coupon.is_active) return <AlertCircle className="h-4 w-4 text-gray-500" />;
    if (isCouponExpired(coupon.expires_at)) return <Clock className="h-4 w-4 text-red-500" />;
    if (coupon.used_count >= coupon.max_usage) return <CheckCircle className="h-4 w-4 text-orange-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coupon Management</h2>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Create a new discount coupon for your customers
              </DialogDescription>
            </DialogHeader>
            <CouponForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleAddCoupon}
              submitLabel="Create Coupon"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expiredCoupons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsage}</div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>Manage your discount coupons</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                return (
                  <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getCouponStatusIcon(coupon)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{coupon.code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCouponCode(coupon.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{coupon.name}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>
                            {coupon.type === 'fixed' 
                              ? `₹${coupon.value} off` 
                              : `${coupon.value}% off${coupon.max_discount ? ` (max ₹${coupon.max_discount})` : ''}`
                            }
                          </span>
                          <span>Min: ₹{coupon.min_order_value}</span>
                          <span>Usage: {coupon.used_count}/{coupon.max_usage}</span>
                          <span>Expires: {formatCouponExpiry(coupon.expires_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(coupon)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCouponToDelete(coupon);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>
              Update the coupon details
            </DialogDescription>
          </DialogHeader>
          <CouponForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleEditCoupon}
            submitLabel="Update Coupon"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{couponToDelete?.code}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Coupon Form Component
interface CouponFormProps {
  formData: CouponFormData;
  setFormData: React.Dispatch<React.SetStateAction<CouponFormData>>;
  onSubmit: () => void;
  submitLabel: string;
}

const CouponForm: React.FC<CouponFormProps> = ({ formData, setFormData, onSubmit, submitLabel }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Coupon Code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            placeholder="WELCOME10"
          />
        </div>
        <div>
          <Label htmlFor="name">Coupon Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Welcome Discount"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Get 10% off on your first order"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Discount Type *</Label>
          <Select value={formData.type} onValueChange={(value: 'fixed' | 'percentage') => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">Discount Value *</Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
            placeholder={formData.type === 'fixed' ? '100' : '10'}
          />
        </div>
      </div>

      {formData.type === 'percentage' && (
        <div>
          <Label htmlFor="max_discount">Max Discount (₹)</Label>
          <Input
            id="max_discount"
            type="number"
            value={formData.max_discount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, max_discount: parseFloat(e.target.value) || undefined }))}
            placeholder="500"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_order_value">Minimum Order Value (₹)</Label>
          <Input
            id="min_order_value"
            type="number"
            value={formData.min_order_value}
            onChange={(e) => setFormData(prev => ({ ...prev, min_order_value: parseFloat(e.target.value) || 0 }))}
            placeholder="1000"
          />
        </div>
        <div>
          <Label htmlFor="max_usage">Max Usage Count</Label>
          <Input
            id="max_usage"
            type="number"
            value={formData.max_usage}
            onChange={(e) => setFormData(prev => ({ ...prev, max_usage: parseInt(e.target.value) || 1 }))}
            placeholder="100"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="expires_at">Expiry Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.expires_at && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.expires_at ? format(formData.expires_at, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.expires_at}
              onSelect={(date) => date && setFormData(prev => ({ ...prev, expires_at: date }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <DialogFooter>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AdminCouponManagement;
