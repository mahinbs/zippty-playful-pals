import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Truck, MapPin, Phone, User, Star, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  features?: string[];
  rating?: number;
  reviews?: number;
}

interface OrderItem {
  product: Product;
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
  amount: number;
  items: OrderItem[];
  delivery_address: DeliveryAddress;
  status: string;
  created_at: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          toast.error('Order not found');
          navigate('/');
          return;
        }

        // Parse the JSON data properly
        const parsedOrder = {
          ...data,
          items: typeof data.items === 'string' ? JSON.parse(data.items) : data.items,
          delivery_address: typeof data.delivery_address === 'string' ? JSON.parse(data.delivery_address) : data.delivery_address
        } as Order;
        
        setOrder(parsedOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          </div>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order #{order.id.slice(-8).toUpperCase()}</span>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Items Ordered
              </h3>
              <div className="space-y-6">
                {order.items.map((item: OrderItem, index: number) => {
                  const { product } = item;
                  return (
                    <Card key={index} className="border border-border/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={product.image || '/placeholder.svg'}
                              alt={product.name}
                              className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1 space-y-4">
                            {/* Product Name and Category */}
                            <div className="space-y-2">
                              <h4 className="text-xl font-semibold">{product.name}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {product.category}
                                </Badge>
                                {product.rating && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{product.rating}</span>
                                    {product.reviews && <span>({product.reviews} reviews)</span>}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Features */}
                            {product.features && product.features.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="font-medium text-sm">Key Features:</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                  {product.features.slice(0, 4).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Pricing and Quantity */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                      <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                                      <Badge variant="destructive" className="text-xs">
                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                      </Badge>
                                    </>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">Price per item</p>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                                <div className="text-xl font-bold">₹{(product.price * item.quantity).toLocaleString()}</div>
                                <div className="text-sm text-muted-foreground">Total</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Delivery Address */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Address
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{order.delivery_address?.fullName || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{order.delivery_address?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-1" />
                  <div>
                    <p>{order.delivery_address?.address || 'Address not provided'}</p>
                    <p>{order.delivery_address?.city || ''}{order.delivery_address?.city && order.delivery_address?.state ? ', ' : ''}{order.delivery_address?.state || ''}{order.delivery_address?.pincode ? ` - ${order.delivery_address.pincode}` : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Total */}
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount Paid</span>
                <span>₹{(order.amount / 100).toLocaleString()}</span>
              </div>
              {order.razorpay_payment_id && (
                <p className="text-sm text-muted-foreground">
                  Payment ID: {order.razorpay_payment_id}
                </p>
              )}
            </div>

            {/* Order Date */}
            <div className="text-sm text-muted-foreground">
              <p>Order placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/shop')} variant="outline">
            Continue Shopping
          </Button>
          <Button onClick={() => navigate('/orders')}>
            View All Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;