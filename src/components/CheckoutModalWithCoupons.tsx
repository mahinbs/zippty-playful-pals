import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { couponsService, CouponValidationResult } from '@/services/coupons';
import { PopupGuide } from './PopupGuide';
import { CheckCircle, X, Tag, Percent, DollarSign, Clock, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface AppliedCoupon {
  id: string;
  code: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  max_discount?: number;
  discount: number;
}

export const CheckoutModalWithCoupons: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { state: { items, total }, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPopupGuide, setShowPopupGuide] = useState(false);
  
  // Coupon states
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  
  const idempotencyKeyRef = useRef(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `idemp_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );

  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Load available coupons when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadAvailableCoupons();
    }
  }, [isOpen, user]);

  const loadAvailableCoupons = async () => {
    try {
      const coupons = await couponsService.getActiveCoupons();
      setAvailableCoupons(coupons);
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!address.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!address.phone || address.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!address.address.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (!address.city.trim()) {
      toast.error('Please enter your city');
      return false;
    }
    if (!address.state.trim()) {
      toast.error('Please enter your state');
      return false;
    }
    if (!address.pincode || address.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const applyCoupon = async () => {
    if (!user) {
      toast.error('Please login to use coupons');
      return;
    }

    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const result: CouponValidationResult = await couponsService.validateCoupon(
        couponCode.trim(),
        user.id,
        total
      );

      if (result.valid) {
        const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
        if (coupon) {
          setAppliedCoupon({
            id: coupon.id,
            code: coupon.code,
            name: coupon.name,
            type: coupon.type,
            value: coupon.value,
            max_discount: coupon.max_discount,
            discount: result.discount,
          });
          toast.success(`Coupon applied! You saved ₹${result.discount}`);
          setCouponCode('');
        }
      } else {
        setCouponError(result.error || 'Invalid coupon');
        toast.error(result.error || 'Invalid coupon');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    toast.success('Coupon removed');
  };

  const calculateFinalAmount = () => {
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    return Math.max(0, total - discount);
  };

  const createOrder = async (finalAmount: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          amount: finalAmount,
          items: items,
          deliveryAddress: address,
          idempotency_key: idempotencyKeyRef.current,
          coupon_id: appliedCoupon?.id || null,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const createPaymentPageContent = (orderData: any) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment - Zippty Playful Pals</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .payment-container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        .logo {
            color: #6366f1;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }
        .pay-button {
            background: #6366f1;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
            transition: background 0.2s;
        }
        .pay-button:hover {
            background: #5855eb;
        }
        .order-details {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: left;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="payment-container">
        <div class="logo">🐾 Zippty Playful Pals</div>
        <div class="order-details">
            <div><strong>Items:</strong> ${items.length} item${items.length > 1 ? 's' : ''}</div>
            <div><strong>Customer:</strong> ${address.fullName}</div>
            <div><strong>Phone:</strong> ${address.phone}</div>
            ${appliedCoupon ? `<div><strong>Coupon:</strong> ${appliedCoupon.code} (₹${appliedCoupon.discount} off)</div>` : ''}
        </div>
        <div class="amount">₹${(orderData.amount / 100).toFixed(2)}</div>
        <button id="payButton" class="pay-button" onclick="initiatePayment()">
            Pay Securely with Razorpay
        </button>
    </div>

    <script>
        const orderData = ${JSON.stringify(orderData)};
        const addressData = ${JSON.stringify(address)};
        const appliedCoupon = ${JSON.stringify(appliedCoupon)};
        
        function initiatePayment() {
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.orderId,
                name: 'Zippty Playful Pals',
                description: 'Order for ${items.length} item${items.length > 1 ? 's' : ''}',
                handler: function(response) {
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'PAYMENT_SUCCESS',
                            data: {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderDbId: orderData.orderDbId,
                                coupon_id: appliedCoupon?.id || null
                            }
                        }, '*');
                    }
                    window.close();
                },
                prefill: {
                    name: addressData.fullName,
                    contact: addressData.phone
                },
                theme: {
                    color: '#6366f1'
                },
                modal: {
                    ondismiss: function() {
                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'PAYMENT_CANCELLED'
                            }, '*');
                        }
                        window.close();
                    }
                }
            };
            
            const rzp = new Razorpay(options);
            rzp.open();
        }
        
        window.onload = function() {
            setTimeout(initiatePayment, 1000);
        };
    </script>
</body>
</html>`;
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const finalAmount = calculateFinalAmount();
      const orderData = await createOrder(finalAmount);

      const windowFeatures = 'width=500,height=700,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no';
      const paymentWindow = window.open('', 'razorpay-payment', windowFeatures);

      if (!paymentWindow) {
        toast.error('Please allow popups for this site to complete payment');
        setLoading(false);
        return;
      }

      paymentWindow.document.write(createPaymentPageContent(orderData));
      paymentWindow.document.close();

      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type === 'PAYMENT_SUCCESS') {
          const { data: paymentData } = event.data;
          
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature,
              },
            });

            if (verifyError) {
              throw new Error('Payment verification failed');
            }

            // Apply coupon if used
            if (paymentData.coupon_id && appliedCoupon) {
              try {
                await couponsService.applyCouponToOrder(
                  paymentData.coupon_id,
                  user.id,
                  paymentData.orderDbId,
                  appliedCoupon.discount
                );
              } catch (error) {
                console.error('Error applying coupon to order:', error);
              }
            }

            clearCart();
            onSuccess(paymentData.orderDbId);
            onClose();
            toast.success('Order placed successfully! Payment completed.');
            
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment processing failed. Please contact support.');
          }
        } else if (event.data.type === 'PAYMENT_CANCELLED') {
          toast.info('Payment was cancelled');
        }

        window.removeEventListener('message', handleMessage);
        setLoading(false);
      };

      window.addEventListener('message', handleMessage);

    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const finalAmount = calculateFinalAmount();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
        
          <div className="space-y-6">
            {/* Delivery Address Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Delivery Address</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={address.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="10-digit phone number"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={address.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={address.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Pincode"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Coupon Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Apply Coupon</h3>
              
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1"
                  />
                  <Button 
                    onClick={applyCoupon} 
                    disabled={couponLoading || !couponCode.trim()}
                    variant="outline"
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                      <p className="text-sm text-green-600">{appliedCoupon.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ₹{appliedCoupon.discount} off
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={removeCoupon}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {couponError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {couponError}
                </div>
              )}

              {/* Available Coupons */}
              {availableCoupons.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Available Coupons:</p>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {availableCoupons.slice(0, 3).map((coupon) => (
                      <Card key={coupon.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="font-medium text-sm">{coupon.code}</p>
                              <p className="text-xs text-muted-foreground">{coupon.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {coupon.type === 'fixed' 
                                ? `₹${coupon.value} off` 
                                : `${coupon.value}% off`
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Min: ₹{coupon.min_order_value}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={loading || items.length === 0}
                className="flex-1"
              >
                {loading ? 'Opening Payment Window...' : `Pay ₹${finalAmount.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PopupGuide 
        isOpen={showPopupGuide} 
        onClose={() => setShowPopupGuide(false)} 
        onRetry={handlePayment}
      />
    </>
  );
};
