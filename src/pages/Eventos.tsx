import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockEventos } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Bell } from "lucide-react";

const Eventos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [suscritos, setSuscritos] = useState<string[]>([]);

  const handleSuscribirse = (eventoId: string, titulo: string) => {
    if (suscritos.includes(eventoId)) {
      setSuscritos(suscritos.filter((id) => id !== eventoId));
      toast({
        title: "Suscripción cancelada",
        description: `Ya no recibirás notificaciones de "${titulo}"`,
      });
    } else {
      setSuscritos([...suscritos, eventoId]);
      toast({
        title: "¡Suscrito!",
        description: `Recibirás una notificación 1 hora antes de "${titulo}"`,
      });
    }
  };

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
          <h1 className="text-xl font-bold">Eventos UC</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Descubre y suscríbete a eventos organizados por las facultades
        </p>

        {mockEventos.map((evento) => {
          const isSuscrito = suscritos.includes(evento.id);
          return (
            <Card key={evento.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-2">{evento.titulo}</CardTitle>
                    <Badge variant="secondary">{evento.facultad}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant={isSuscrito ? "default" : "outline"}
                    onClick={() => handleSuscribirse(evento.id, evento.titulo)}
                    className="gap-2 shrink-0"
                  >
                    <Bell className="w-4 h-4" />
                    {isSuscrito ? "Suscrito" : "Suscribirse"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-foreground">{evento.descripcion}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(evento.fecha).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {evento.hora}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {evento.lugar}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {evento.inscritos} inscritos
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Eventos;
