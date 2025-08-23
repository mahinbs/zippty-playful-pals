import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/services/api";
import { toast } from "sonner";

interface OrderItem {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
}

interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  status: string;
  items: OrderItem[];
  delivery_address: DeliveryAddress;
  created_at: string;
  updated_at: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [orderId, orders]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion with proper conversion
      const typedOrders = (data || []).map((order) => ({
        ...order,
        items: order.items as unknown as OrderItem[],
        delivery_address: order.delivery_address as unknown as DeliveryAddress,
      })) as Order[];

      setOrders(typedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 sm:py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Single order view
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-4 sm:py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedOrder(null);
                  navigate("/orders");
                }}
                className="mr-3 sm:mr-4"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Orders</span>
              </Button>
              <h1 className="text-xl sm:text-3xl font-bold text-foreground">
                Order Details
              </h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Order Info */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <GlassCard className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                      Order #{selectedOrder.id.slice(-8)}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="self-start sm:self-auto">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-foreground text-base sm:text-lg">
                    Items Ordered
                  </h3>
                  {selectedOrder.items.map((item: OrderItem, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm sm:text-base">
                          {item.product.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Delivery Address */}
              <GlassCard className="p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Delivery Address
                </h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="font-medium text-foreground flex items-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {selectedOrder.delivery_address.fullName}
                  </p>
                  <p className="text-muted-foreground flex items-center">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {selectedOrder.delivery_address.phone}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedOrder.delivery_address.address}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedOrder.delivery_address.city},{" "}
                    {selectedOrder.delivery_address.state} -{" "}
                    {selectedOrder.delivery_address.pincode}
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <GlassCard className="p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">
                  Order Summary
                </h3>

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  {(() => {
                    const totalAmount = selectedOrder.amount / 100; // Convert from paise to rupees
                    const shippingCost = totalAmount >= 4200 ? 0 : 200; // If total >= 4200, shipping was free
                    const subtotal = totalAmount - shippingCost;

                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-muted-foreground">
                            Subtotal
                          </span>
                          <span className="text-sm sm:text-base text-foreground">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base text-muted-foreground">
                            Shipping
                          </span>
                          <span className="text-sm sm:text-base text-foreground">
                            {shippingCost === 0
                              ? "Free"
                              : formatPrice(shippingCost)}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 sm:pt-3">
                          <div className="flex justify-between">
                            <span className="text-base sm:text-lg font-semibold text-foreground">
                              Total
                            </span>
                            <span className="text-base sm:text-lg font-bold text-primary">
                              {formatPrice(totalAmount)}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {selectedOrder.razorpay_payment_id && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-muted rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Payment ID
                    </p>
                    <p className="font-mono text-xs text-foreground break-all">
                      {selectedOrder.razorpay_payment_id}
                    </p>
                  </div>
                )}

                {selectedOrder.status === "paid" && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center text-green-700 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm font-medium">
                        Order Confirmed
                      </span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                      Your order will be delivered within 5-7 business days
                    </p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Orders list view
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-3xl font-bold text-foreground">
              My Orders
            </h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Package className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
              No Orders Yet
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <Button
              onClick={() => navigate("/shop")}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <GlassCard
                key={order.id}
                className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-3 sm:mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="self-start sm:self-auto">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                    <p className="font-semibold text-primary text-sm sm:text-base">
                      {formatPrice(order.amount / 100)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start sm:self-auto"
                  >
                    View Details
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
