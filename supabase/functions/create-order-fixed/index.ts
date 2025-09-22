import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateOrderRequest {
  amount: number;
  items: any[];
  deliveryAddress: any;
  idempotency_key?: string;
  coupon_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !userData.user) {
      console.error("Auth error:", authError);
      throw new Error("User not authenticated");
    }

    const user = userData.user;
    console.log("User authenticated:", user.id);

    // Parse request body
    let body: CreateOrderRequest;
    try {
      body = await req.json();
    } catch (e) {
      throw new Error("Invalid JSON in request body");
    }

    const { amount, items, deliveryAddress, idempotency_key, coupon_id } = body;

    // Validate input
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    if (!deliveryAddress) {
      throw new Error("Delivery address is required");
    }

    console.log("Creating order for amount:", amount);

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Generate a unique idempotency key if not provided
    const finalIdempotencyKey = idempotency_key || `order_${user.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Check for existing order with this idempotency key
    const { data: existingOrder, error: existingOrderError } = await supabaseClient
      .from("orders")
      .select("id, razorpay_order_id, amount, currency, status")
      .eq("user_id", user.id)
      .eq("idempotency_key", finalIdempotencyKey)
      .maybeSingle();

    if (existingOrderError) {
      console.error("Error checking existing order:", existingOrderError);
      // Continue with creating new order
    } else if (existingOrder && existingOrder.razorpay_order_id) {
      console.log("Existing order found for idempotency_key:", finalIdempotencyKey);
      return new Response(
        JSON.stringify({
          orderId: existingOrder.razorpay_order_id,
          amount: existingOrder.amount,
          currency: existingOrder.currency || "INR",
          keyId: razorpayKeyId,
          orderDbId: existingOrder.id,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log("No existing order. Creating new Razorpay order");

    // Create order with Razorpay
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer
        currency: "INR",
        receipt: `order_${Date.now()}_${user.id.substring(0, 8)}`,
      }),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error("Razorpay API error:", errorText);
      throw new Error(`Failed to create Razorpay order: ${razorpayResponse.statusText}`);
    }

    const razorpayOrderData = await razorpayResponse.json();
    console.log("Razorpay order created:", razorpayOrderData.id);

    // Create order in database using service role key to bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Try to create order with retry logic for idempotency key conflicts
    let order;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const { data: orderData, error: dbError } = await supabaseService
          .from("orders")
          .insert({
            user_id: user.id,
            razorpay_order_id: razorpayOrderData.id,
            amount: Math.round(amount * 100), // Store in paise
            items: items,
            delivery_address: deliveryAddress,
            status: "pending",
            idempotency_key: finalIdempotencyKey,
            coupon_id: coupon_id || null,
            discount_amount: 0, // Will be updated after coupon validation
          })
          .select()
          .single();

        if (dbError) {
          // If it's a unique constraint violation on idempotency_key, try with a new key
          if (dbError.code === "23505" && dbError.message.includes("idempotency_key")) {
            console.log(`Idempotency key conflict, retrying with new key (attempt ${retryCount + 1})`);
            retryCount++;
            const newIdempotencyKey = `order_${user.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            // Update the key for next attempt
            finalIdempotencyKey = newIdempotencyKey;
            continue;
          } else {
            console.error("Database error:", dbError);
            throw new Error("Failed to create order in database");
          }
        }

        order = orderData;
        break; // Success, exit retry loop
      } catch (error) {
        if (retryCount >= maxRetries - 1) {
          throw error;
        }
        retryCount++;
        console.log(`Database error, retrying (attempt ${retryCount + 1}):`, error);
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    if (!order) {
      throw new Error("Failed to create order after retries");
    }

    console.log("Order created in database:", order.id);

    return new Response(
      JSON.stringify({
        orderId: razorpayOrderData.id,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        keyId: razorpayKeyId,
        orderDbId: order.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
