import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockLugares } from "@/data/mockData";
import { Lugar } from "@/types";
import { Search, MapPin, Star, LogOut, Calendar, MessageCircle, Settings } from "lucide-react";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    "con enchufes",
    "acepta JUNAEB",
    "opción vegana",
    "baño accesible",
    "wifi rápido",
    "silencioso",
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filteredLugares = mockLugares.filter((lugar) => {
    const matchesSearch =
      lugar.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lugar.tipo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.every((filter) => lugar.etiquetas.includes(filter));
    return matchesSearch && matchesFilters;
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Red UC</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm hidden sm:inline">Hola, {user?.nombre}</span>
            {user?.isAdmin && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate("/admin")}
                className="gap-1"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            )}
            <Button size="sm" variant="secondary" onClick={handleLogout} className="gap-1">
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Buscar lugares en el campus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant={selectedFilters.includes(filter) ? "default" : "outline"}
              className="cursor-pointer hover:bg-accent transition-colors py-2 px-3"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate("/eventos")}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Eventos</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate("/chatbot")}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm">Asistente</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 col-span-2 sm:col-span-1"
            onClick={() => navigate("/mapa")}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-sm">Ver Mapa</span>
          </Button>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            {filteredLugares.length} lugares encontrados
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLugares.map((lugar) => (
              <Card
                key={lugar.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/lugar/${lugar.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{lugar.nombre}</h3>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {lugar.tipo}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{lugar.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({lugar.reseñas.length} reseñas)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {lugar.descripcion}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {lugar.etiquetas.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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

export default Home;
