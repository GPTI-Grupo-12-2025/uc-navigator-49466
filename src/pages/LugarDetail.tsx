import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockLugares } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

const LugarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const lugar = mockLugares.find((l) => l.id === id);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  if (!lugar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lugar no encontrado</p>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (!newReview.trim()) {
      toast({
        title: "Error",
        description: "Escribe una reseña antes de enviar",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "¡Reseña enviada!",
      description: "Gracias por tu opinión. +50 UCPuntos ganados! 🎉",
    });
    setNewReview("");
  };

  const handleCreateAlert = (tipo: "lleno" | "mantenimiento" | "cerrado") => {
    toast({
      title: "Alerta creada",
      description: `Se ha reportado: ${tipo}. Expira en 6 horas. +30 UCPuntos ganados!`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
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
          <h1 className="text-xl font-bold">{lugar.nombre}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Info básica */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="mb-2">{lugar.tipo}</Badge>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">{lugar.rating}</span>
                  <span className="text-muted-foreground">
                    ({lugar.reseñas.length} reseñas)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-foreground">{lugar.descripcion}</p>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{lugar.horario}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {lugar.lat.toFixed(4)}, {lugar.lng.toFixed(4)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {lugar.etiquetas.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        {lugar.alertas && lugar.alertas.length > 0 && (
          <Card className="border-orange-300 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Alertas Activas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lugar.alertas.map((alerta) => (
                <div key={alerta.id} className="text-sm">
                  <p className="font-medium text-orange-800">{alerta.texto}</p>
                  <p className="text-xs text-orange-600">
                    Expira: {new Date(alerta.expira).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Crear alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reportar situación</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCreateAlert("lleno")}
            >
              Lugar lleno
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCreateAlert("mantenimiento")}
            >
              En mantenimiento
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCreateAlert("cerrado")}
            >
              Cerrado
            </Button>
          </CardContent>
        </Card>

        {/* Reseñas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Reseñas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nueva reseña */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Tu calificación:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 cursor-pointer ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <Textarea
                placeholder="Escribe tu reseña..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="min-h-20"
              />
              <Button onClick={handleSubmitReview} size="sm">
                Publicar reseña
              </Button>
            </div>

            {/* Lista de reseñas */}
            <div className="space-y-3 pt-3 border-t">
              {lugar.reseñas.map((reseña) => (
                <div key={reseña.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{reseña.usuario}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{reseña.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{reseña.texto}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reseña.fecha).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LugarDetail;
