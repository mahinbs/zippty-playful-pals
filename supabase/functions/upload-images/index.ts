import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get Cloudinary credentials from environment
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    console.log('Environment check:', {
      cloudName: cloudName ? 'present' : 'missing',
      apiKey: apiKey ? 'present' : 'missing',
      apiSecret: apiSecret ? 'present' : 'missing'
    });

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials');
      return new Response(
        JSON.stringify({ 
          error: 'Cloudinary credentials not configured',
          details: {
            cloudName: cloudName ? 'present' : 'missing',
            apiKey: apiKey ? 'present' : 'missing',
            apiSecret: apiSecret ? 'present' : 'missing'
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse form data
    const formData = await req.formData();
    
    // Get uploaded files
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing ${files.length} files`);

    // Upload files to Cloudinary
    const uploadPromises = files.map(async (file, index) => {
      try {
        console.log(`Uploading file ${index + 1}: ${file.name}, size: ${file.size}`);
        
        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        const dataUri = `data:${file.type};base64,${base64Data}`;

        // Upload to Cloudinary
        const uploadData = new FormData();
        uploadData.append('file', dataUri);
        uploadData.append('upload_preset', 'ml_default'); // You may need to create this in Cloudinary
        uploadData.append('folder', 'zippty-products');
        
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: uploadData,
          }
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`Cloudinary upload failed for file ${index + 1}:`, errorText);
          throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        const result = await uploadResponse.json();
        console.log(`Successfully uploaded file ${index + 1}:`, result.secure_url);
        
        return {
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
          filename: file.name
        };
      } catch (error) {
        console.error(`Error uploading file ${index + 1}:`, error);
        return {
          success: false,
          error: error.message,
          filename: file.name
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`Upload complete. Successful: ${successful.length}, Failed: ${failed.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        uploaded: successful,
        failed: failed,
        total: files.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Upload function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});