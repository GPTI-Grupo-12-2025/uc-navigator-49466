import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockLugares } from "@/data/mockData";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";

const Mapa = () => {
  const navigate = useNavigate();

  // Simulated user location (Campus UC San Joaquín)
  const userLocation = { lat: -33.4985, lng: -70.6138 };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c * 1000).toFixed(0); // Distance in meters
  };

  const lugaresConDistancia = mockLugares.map((lugar) => ({
    ...lugar,
    distancia: calculateDistance(
      userLocation.lat,
      userLocation.lng,
      lugar.lat,
      lugar.lng
    ),
  }));

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

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Placeholder for actual map - would integrate Google Maps or Leaflet */}
        <Card className="bg-muted">
          <CardContent className="p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Vista de Mapa</h3>
            <p className="text-sm text-muted-foreground mb-4">
              En producción, aquí se mostraría un mapa interactivo con tu ubicación y los
              lugares cercanos
            </p>
            <Badge variant="secondary">
              <Navigation className="w-3 h-3 mr-1" />
              Tu ubicación: Campus San Joaquín
            </Badge>
          </CardContent>
        </Card>

        {/* List of places with distances */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Lugares Cercanos</h2>
          <div className="space-y-3">
            {lugaresConDistancia
              .sort((a, b) => Number(a.distancia) - Number(b.distancia))
              .map((lugar) => (
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Navigation className="w-4 h-4" />
                          <span>{lugar.distancia}m de distancia</span>
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
