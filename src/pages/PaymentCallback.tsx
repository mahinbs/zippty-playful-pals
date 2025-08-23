import React, { useEffect } from 'react';

const PaymentPage: React.FC = () => {
  useEffect(() => {
    const loadRazorpayAndPay = async () => {
      try {
        // Get payment data from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const paymentDataStr = urlParams.get('data');
        
        if (!paymentDataStr) {
          console.error('No payment data found');
          window.close();
          return;
        }

        const paymentData = JSON.parse(decodeURIComponent(paymentDataStr));

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          // Initialize Razorpay payment
          const rzp = new window.Razorpay({
            ...paymentData,
            handler: async (response: any) => {
              try {
                console.log('Payment successful:', response);
                
                // Set success flags for parent window
                sessionStorage.setItem('paymentSuccess', 'true');
                sessionStorage.setItem('paymentOrderId', paymentData.orderDbId);
                sessionStorage.setItem('razorpayPaymentId', response.razorpay_payment_id);
                sessionStorage.setItem('razorpayOrderId', response.razorpay_order_id);
                
                // Small delay to ensure sessionStorage is set
                await new Promise(resolve => setTimeout(resolve, 100));
                
                console.log('Session storage set, closing window');
                // Close this payment window
                window.close();
              } catch (error) {
                console.error('Payment success handling failed:', error);
                sessionStorage.setItem('paymentSuccess', 'false');
                window.close();
              }
            },
            modal: {
              ondismiss: () => {
                console.log('Payment dismissed by user');
                sessionStorage.setItem('paymentSuccess', 'false');
                setTimeout(() => window.close(), 100);
              }
            }
          });
          
          // Open payment modal
          rzp.open();
        };

        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          sessionStorage.setItem('paymentSuccess', 'false');
          window.close();
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('Payment initialization failed:', error);
        sessionStorage.setItem('paymentSuccess', 'false');
        window.close();
      }
    };

    loadRazorpayAndPay();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading payment gateway...</p>
        <p className="text-sm text-muted-foreground">Please wait while we initialize your payment.</p>
      </div>
    </div>
  );
};

export default PaymentPage;