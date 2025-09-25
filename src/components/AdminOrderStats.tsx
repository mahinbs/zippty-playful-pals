import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, CheckCircle, Truck, AlertCircle, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
  potentialRevenue: number;
}

const AdminOrderStats = () => {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    potentialRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setLoading(true);
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, amount');

      if (error) throw error;

      if (orders) {
        const total = orders.length;
        const pending = orders.filter(o => o.status === 'pending').length;
        const processing = orders.filter(o => o.status === 'processing').length;
        const shipped = orders.filter(o => o.status === 'shipped').length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;
        
        // Only count revenue from delivered orders (successful transactions)
        const revenueGeneratingOrders = orders.filter(o => 
          o.status === 'delivered' || o.status === 'shipped' || o.status === 'processing'
        );
        const totalRevenue = revenueGeneratingOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const averageOrderValue = revenueGeneratingOrders.length > 0 ? totalRevenue / revenueGeneratingOrders.length : 0;
        
        // Calculate potential revenue from pending orders
        const pendingOrders = orders.filter(o => o.status === 'pending');
        const potentialRevenue = pendingOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
        
        // Debug logging to check actual values
        console.log('Revenue calculation debug:', {
          totalRevenue,
          potentialRevenue,
          sampleOrder: revenueGeneratingOrders[0],
          allOrders: orders.slice(0, 3)
        });

        setStats({
          total,
          pending,
          processing,
          shipped,
          delivered,
          cancelled,
          totalRevenue,
          averageOrderValue,
          potentialRevenue,
        });
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    // If amount is very large (likely in paise), convert to rupees
    // Assuming amounts over 1000 are in paise and need conversion
    const displayAmount = amount > 1000 ? amount / 100 : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(displayAmount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time orders</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex col-span-2 lg:col-span-1 flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confirmed Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            Avg: {formatCurrency(stats.averageOrderValue)} (from completed orders)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.potentialRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            From {stats.pending} pending orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <Badge variant="secondary" className="text-xs">
            Needs attention
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          <Badge variant="secondary" className="text-xs">
            In progress
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shipped</CardTitle>
          <Truck className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
          <Badge variant="secondary" className="text-xs">
            On the way
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          <Badge variant="default" className="text-xs">
            Completed
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <Badge variant="destructive" className="text-xs">
            Cancelled
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0}%
          </div>
          <Badge variant="default" className="text-xs">
            Delivery rate
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderStats;