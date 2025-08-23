import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PaymentCallback: React.FC = () => {
  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const razorpayPaymentId = urlParams.get('razorpay_payment_id');
        const razorpayOrderId = urlParams.get('razorpay_order_id');
        const razorpaySignature = urlParams.get('razorpay_signature');

        const pendingOrderData = sessionStorage.getItem('pendingOrderData');
        
        if (razorpayPaymentId && razorpayOrderId && pendingOrderData) {
          const orderData = JSON.parse(pendingOrderData);
          
          // Update order status in database
          await supabase
            .from('orders')
            .update({
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: razorpayPaymentId,
              status: 'paid',
            })
            .eq('id', orderData.orderDbId);

          // Set success flags for parent window
          sessionStorage.setItem('paymentSuccess', 'true');
          sessionStorage.setItem('paymentOrderId', orderData.orderDbId);
          
          // Close this payment window
          window.close();
        } else {
          // Payment failed or cancelled
          sessionStorage.setItem('paymentSuccess', 'false');
          window.close();
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        sessionStorage.setItem('paymentSuccess', 'false');
        window.close();
      }
    };

    handlePaymentCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Processing your payment...</p>
        <p className="text-sm text-muted-foreground">This window will close automatically.</p>
      </div>
    </div>
  );
};

export default PaymentCallback;