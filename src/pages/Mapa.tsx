import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockLugares } from "@/data/mockData";
import { ArrowLeft, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Mapa = () => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Campus UC San Joaquín as default center
  const defaultCenter: [number, number] = [-33.4985, -70.6138];

  useEffect(() => {
    // Initialize map
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(defaultCenter, 15);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers for all lugares
    mockLugares.forEach((lugar) => {
      const marker = L.marker([lugar.lat, lugar.lng]).addTo(map);
      
      const mapsUrl = `https://www.google.com/maps?q=${lugar.lat},${lugar.lng}`;
      const popupContent = `
        <div style="font-family: system-ui, sans-serif;">
          <strong style="font-size: 14px;">${lugar.nombre}</strong><br/>
          <span style="font-size: 12px; color: #666;">${lugar.tipo}</span><br/>
          <span style="font-size: 12px;">${lugar.descripcion}</span><br/>
          <div style="margin-top: 8px; display: flex; gap: 4px;">
            <button onclick="window.location.href='/lugar/${lugar.id}'" style="padding: 4px 8px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Ver detalles</button>
            <button onclick="window.open('${mapsUrl}', '_blank')" style="padding: 4px 8px; background: #34a853; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Google Maps</button>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });

          // Add user location marker
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div style="background: #4285f4; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });

          const userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
          userMarker.bindPopup(`<strong>Tu ubicación</strong><br/>Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
          
          // Center map on user location
          map.setView([lat, lng], 15);
        },
        (err) => {
          console.warn("Error getting location:", err);
        }
      );
    }

    // Right-click to show coordinates
    map.on("contextmenu", (e) => {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div style="font-family: system-ui, sans-serif;">
            <strong>Coordenadas seleccionadas</strong><br/>
            <span style="font-size: 12px;">Lat: ${lat}, Lng: ${lng}</span><br/>
            <button onclick="window.open('${mapsUrl}', '_blank')" style="margin-top: 6px; padding: 4px 8px; background: #34a853; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Abrir en Google Maps</button>
          </div>
        `)
        .openOn(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate("/home")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h1 className="text-xl font-bold">Mapa del Campus</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Interactive Leaflet Map */}
        <Card>
          <CardContent className="p-0">
            <div 
              ref={mapContainerRef} 
              style={{ height: "600px", width: "100%", borderRadius: "var(--radius)" }}
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Navigation className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p className="font-semibold text-foreground mb-1">Cómo usar el mapa:</p>
                <ul className="space-y-1">
                  <li>• Haz clic en los marcadores para ver información de cada lugar</li>
                  <li>• Click derecho en cualquier punto para ver sus coordenadas</li>
                  <li>• {userLocation ? "Tu ubicación está marcada en azul" : "Permite el acceso a ubicación para verte en el mapa"}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List of places */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Todos los Lugares ({mockLugares.length})</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {mockLugares.map((lugar) => (
              <Card
                key={lugar.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/lugar/${lugar.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{lugar.nombre}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {lugar.descripcion}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {lugar.lat.toFixed(4)}, {lugar.lng.toFixed(4)}
                      </div>
                    </div>
                    <Badge variant="secondary">{lugar.tipo}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
