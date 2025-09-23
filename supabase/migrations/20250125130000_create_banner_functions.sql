-- Create functions for banner management

-- Function to get active banners
CREATE OR REPLACE FUNCTION get_active_banners()
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  background_image TEXT,
  overlay_opacity INTEGER,
  text_color TEXT,
  is_active BOOLEAN,
  display_order INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.subtitle,
    b.description,
    b.button_text,
    b.button_link,
    b.background_image,
    b.overlay_opacity,
    b.text_color,
    b.is_active,
    b.display_order,
    b.created_at,
    b.updated_at
  FROM public.banners b
  WHERE b.is_active = true
  ORDER BY b.display_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all banners
CREATE OR REPLACE FUNCTION get_all_banners()
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  background_image TEXT,
  overlay_opacity INTEGER,
  text_color TEXT,
  is_active BOOLEAN,
  display_order INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.subtitle,
    b.description,
    b.button_text,
    b.button_link,
    b.background_image,
    b.overlay_opacity,
    b.text_color,
    b.is_active,
    b.display_order,
    b.created_at,
    b.updated_at
  FROM public.banners b
  ORDER BY b.display_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a banner
CREATE OR REPLACE FUNCTION create_banner(
  p_title TEXT,
  p_subtitle TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_button_text TEXT DEFAULT 'Shop Now',
  p_button_link TEXT DEFAULT '/shop',
  p_background_image TEXT DEFAULT NULL,
  p_overlay_opacity INTEGER DEFAULT 30,
  p_text_color TEXT DEFAULT 'white',
  p_is_active BOOLEAN DEFAULT true,
  p_display_order INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  background_image TEXT,
  overlay_opacity INTEGER,
  text_color TEXT,
  is_active BOOLEAN,
  display_order INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  new_banner public.banners%ROWTYPE;
BEGIN
  INSERT INTO public.banners (
    title,
    subtitle,
    description,
    button_text,
    button_link,
    background_image,
    overlay_opacity,
    text_color,
    is_active,
    display_order
  ) VALUES (
    p_title,
    p_subtitle,
    p_description,
    p_button_text,
    p_button_link,
    p_background_image,
    p_overlay_opacity,
    p_text_color,
    p_is_active,
    p_display_order
  ) RETURNING * INTO new_banner;
  
  RETURN QUERY SELECT 
    new_banner.id,
    new_banner.title,
    new_banner.subtitle,
    new_banner.description,
    new_banner.button_text,
    new_banner.button_link,
    new_banner.background_image,
    new_banner.overlay_opacity,
    new_banner.text_color,
    new_banner.is_active,
    new_banner.display_order,
    new_banner.created_at,
    new_banner.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update a banner
CREATE OR REPLACE FUNCTION update_banner(
  p_id UUID,
  p_title TEXT DEFAULT NULL,
  p_subtitle TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_button_text TEXT DEFAULT NULL,
  p_button_link TEXT DEFAULT NULL,
  p_background_image TEXT DEFAULT NULL,
  p_overlay_opacity INTEGER DEFAULT NULL,
  p_text_color TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL,
  p_display_order INTEGER DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  background_image TEXT,
  overlay_opacity INTEGER,
  text_color TEXT,
  is_active BOOLEAN,
  display_order INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  updated_banner public.banners%ROWTYPE;
BEGIN
  UPDATE public.banners SET
    title = COALESCE(p_title, title),
    subtitle = COALESCE(p_subtitle, subtitle),
    description = COALESCE(p_description, description),
    button_text = COALESCE(p_button_text, button_text),
    button_link = COALESCE(p_button_link, button_link),
    background_image = COALESCE(p_background_image, background_image),
    overlay_opacity = COALESCE(p_overlay_opacity, overlay_opacity),
    text_color = COALESCE(p_text_color, text_color),
    is_active = COALESCE(p_is_active, is_active),
    display_order = COALESCE(p_display_order, display_order),
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO updated_banner;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Banner with id % not found', p_id;
  END IF;
  
  RETURN QUERY SELECT 
    updated_banner.id,
    updated_banner.title,
    updated_banner.subtitle,
    updated_banner.description,
    updated_banner.button_text,
    updated_banner.button_link,
    updated_banner.background_image,
    updated_banner.overlay_opacity,
    updated_banner.text_color,
    updated_banner.is_active,
    updated_banner.display_order,
    updated_banner.created_at,
    updated_banner.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a banner
CREATE OR REPLACE FUNCTION delete_banner(p_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.banners WHERE id = p_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Banner with id % not found', p_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle banner status
CREATE OR REPLACE FUNCTION toggle_banner_status(p_id UUID, p_is_active BOOLEAN)
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  background_image TEXT,
  overlay_opacity INTEGER,
  text_color TEXT,
  is_active BOOLEAN,
  display_order INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  updated_banner public.banners%ROWTYPE;
BEGIN
  UPDATE public.banners SET
    is_active = p_is_active,
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO updated_banner;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Banner with id % not found', p_id;
  END IF;
  
  RETURN QUERY SELECT 
    updated_banner.id,
    updated_banner.title,
    updated_banner.subtitle,
    updated_banner.description,
    updated_banner.button_text,
    updated_banner.button_link,
    updated_banner.background_image,
    updated_banner.overlay_opacity,
    updated_banner.text_color,
    updated_banner.is_active,
    updated_banner.display_order,
    updated_banner.created_at,
    updated_banner.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update banner order
CREATE OR REPLACE FUNCTION update_banner_order(p_banners JSONB)
RETURNS VOID AS $$
DECLARE
  banner_item JSONB;
BEGIN
  FOR banner_item IN SELECT * FROM jsonb_array_elements(p_banners)
  LOOP
    UPDATE public.banners SET
      display_order = (banner_item->>'display_order')::INTEGER,
      updated_at = NOW()
    WHERE id = (banner_item->>'id')::UUID;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
