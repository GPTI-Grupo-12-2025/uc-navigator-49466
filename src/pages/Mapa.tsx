import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockLugares, mockEventos } from "@/data/mockData";
import { ArrowLeft, Search, MapPin, Calendar, Star, Users } from "lucide-react";
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
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "distancia">("rating");
  const [activeTab, setActiveTab] = useState<"lugares" | "eventos">("lugares");

  // Campus UC San Joaquín as default center
  const defaultCenter: [number, number] = [-33.4985, -70.6138];

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and sort lugares
  const filteredLugares = mockLugares
    .filter(lugar => 
      lugar.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lugar.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lugar.tipo.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "distancia" && userLocation) {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      }
      return 0;
    });

  // Filter eventos
  const filteredEventos = mockEventos
    .filter(evento => 
      evento.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.facultad.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by date
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });

  // Center map on a location
  const centerOnLocation = (lat: number, lng: number, lugarId?: string) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 17);
      if (lugarId && markersRef.current[lugarId]) {
        markersRef.current[lugarId].openPopup();
      }
    }
  };

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
      markersRef.current[lugar.id] = marker;
      
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
        <div className="max-w-7xl mx-auto flex items-center gap-3">
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

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-4 relative">
          {/* Sidebar Overlay */}
          <Card className="w-96 flex-shrink-0 h-[calc(100vh-180px)] flex flex-col">
            <CardContent className="p-4 flex flex-col gap-4 h-full">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "lugares" | "eventos")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="lugares">
                    <MapPin className="w-4 h-4 mr-2" />
                    Lugares
                  </TabsTrigger>
                  <TabsTrigger value="eventos">
                    <Calendar className="w-4 h-4 mr-2" />
                    Eventos
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={activeTab === "lugares" ? "Buscar lugares..." : "Buscar eventos..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Sort - only for lugares */}
                  {activeTab === "lugares" && (
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as "rating" | "distancia")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ordenar por..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Por rating</SelectItem>
                        <SelectItem value="distancia" disabled={!userLocation}>
                          Por cercanía {!userLocation && "(activa ubicación)"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Content Lists */}
                <TabsContent value="lugares" className="flex-1 mt-4">
                  <ScrollArea className="h-[calc(100vh-420px)]">
                    <div className="space-y-2 pr-4">
                      {filteredLugares.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No se encontraron lugares
                        </p>
                      ) : (
                        filteredLugares.map((lugar) => {
                          const distance = userLocation 
                            ? calculateDistance(userLocation.lat, userLocation.lng, lugar.lat, lugar.lng)
                            : null;
                          
                          return (
                            <Card
                              key={lugar.id}
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => centerOnLocation(lugar.lat, lugar.lng, lugar.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-sm truncate">{lugar.nombre}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                      {lugar.descripcion}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-medium">{lugar.rating}</span>
                                      </div>
                                      {distance && (
                                        <span className="text-xs text-muted-foreground">
                                          • {distance.toFixed(2)} km
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                                    {lugar.tipo}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="eventos" className="flex-1 mt-4">
                  <ScrollArea className="h-[calc(100vh-420px)]">
                    <div className="space-y-2 pr-4">
                      {filteredEventos.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No se encontraron eventos
                        </p>
                      ) : (
                        filteredEventos.map((evento) => (
                          <Card
                            key={evento.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/eventos`)}
                          >
                            <CardContent className="p-3">
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                                    {evento.titulo}
                                  </h3>
                                  <Badge variant="outline" className="text-xs flex-shrink-0">
                                    {evento.facultad}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {evento.descripcion}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(evento.fecha).toLocaleDateString('es-CL')}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {evento.inscritos}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="flex-1">
            <CardContent className="p-0">
              <div 
                ref={mapContainerRef} 
                style={{ height: "calc(100vh - 180px)", width: "100%", borderRadius: "var(--radius)" }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
