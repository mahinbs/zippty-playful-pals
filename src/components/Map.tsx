import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    // Try to get token from environment first
    const envToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (envToken) {
      setMapboxToken(envToken);
      setShowTokenInput(false);
      initializeMap(envToken);
    }
  }, []);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    // Initialize map
    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [75.7873, 26.9124], // Jaipur coordinates
      zoom: 13,
    });

    // Add marker for Zippty location
    new mapboxgl.Marker({
      color: '#8B5CF6',
    })
    .setLngLat([75.7873, 26.9124])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML('<div style="padding: 8px;"><strong>Zippty Playful Pals</strong><br/>JP Colony, Shastri Nagar, Jaipur</div>')
    )
    .addTo(map.current);

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Cleanup
    return () => {
      map.current?.remove();
    };
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  if (showTokenInput) {
    return (
      <div className="bg-card rounded-3xl p-8 border border-border shadow-soft h-96 flex flex-col items-center justify-center space-y-4">
        <MapPin className="h-12 w-12 text-primary" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Interactive Map</h3>
          <p className="text-sm text-muted-foreground">
            Please enter your Mapbox public token to view the map
          </p>
          <p className="text-xs text-muted-foreground">
            Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
        </div>
        <div className="flex gap-2 w-full max-w-md">
          <Input
            placeholder="Mapbox public token..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-3xl overflow-hidden border border-border shadow-soft">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;