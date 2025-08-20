import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// Removed compression function since OffscreenCanvas is not available in Deno edge functions
// Images will be uploaded directly to Cloudinary with server-side transformations

async function uploadToCloudinary(imageFile: File): Promise<CloudinaryResponse> {
  const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
  const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
  const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

  console.log('Checking Cloudinary credentials...');
  console.log('Cloud name exists:', !!cloudName);
  console.log('API key exists:', !!apiKey);
  console.log('API secret exists:', !!apiSecret);

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary credentials:', {
      cloudName: !!cloudName,
      apiKey: !!apiKey,
      apiSecret: !!apiSecret
    });
    throw new Error(`Missing Cloudinary credentials: cloudName=${!!cloudName}, apiKey=${!!apiKey}, apiSecret=${!!apiSecret}`);
  }

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('api_key', apiKey);
  formData.append('upload_preset', 'ml_default'); // Use default preset
  
  // Add transformation for additional compression and optimization
  formData.append('transformation', 'c_limit,w_1024,h_1024,q_auto:good');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cloudinary upload failed:', errorText);
    throw new Error(`Cloudinary upload failed: ${response.status}`);
  }

  return await response.json() as CloudinaryResponse;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing image upload request...');
    
    const formData = await req.formData();
    const imageFiles = formData.getAll('images') as File[];
    
    if (!imageFiles || imageFiles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No images provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log(`Processing ${imageFiles.length} image(s)...`);

    const uploadPromises = imageFiles.map(async (file) => {
      try {
        console.log(`Uploading image: ${file.name} (${file.size} bytes)`);
        
        // Upload directly to Cloudinary (will handle compression server-side)
        const result = await uploadToCloudinary(file);
        console.log(`Uploaded successfully: ${result.secure_url}`);
        
        return {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
          originalName: file.name
        };
      } catch (error) {
        console.error(`Failed to process image ${file.name}:`, error);
        throw new Error(`Failed to process image ${file.name}: ${error.message}`);
      }
    });

    const results = await Promise.all(uploadPromises);
    
    console.log(`Successfully uploaded ${results.length} image(s)`);

    return new Response(
      JSON.stringify({ 
        success: true,
        images: results,
        message: `Successfully uploaded ${results.length} image(s)` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in upload-images function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to upload images',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});