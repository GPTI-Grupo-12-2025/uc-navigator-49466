import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { mockLugares, mockEventos } from "@/data/mockData";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"lugares" | "eventos">("lugares");

  // Redirect if not admin
  if (!user?.isAdmin) {
    navigate("/home");
    return null;
  }

  const handleAddLugar = () => {
    toast({
      title: "Lugar agregado",
      description: "El nuevo lugar ha sido agregado exitosamente",
    });
  };

  const handleAddEvento = () => {
    toast({
      title: "Evento agregado",
      description: "El nuevo evento ha sido agregado exitosamente",
    });
  };

  const handleDelete = (tipo: string, id: string) => {
    toast({
      title: `${tipo} eliminado`,
      description: "El elemento ha sido eliminado exitosamente",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate("/home")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h1 className="text-xl font-bold">Panel Administrativo</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "lugares" ? "default" : "outline"}
            onClick={() => setActiveTab("lugares")}
          >
            Gestionar Lugares
          </Button>
          <Button
            variant={activeTab === "eventos" ? "default" : "outline"}
            onClick={() => setActiveTab("eventos")}
          >
            Gestionar Eventos
          </Button>
        </div>

        {/* Lugares Tab */}
        {activeTab === "lugares" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Agregar Nuevo Lugar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Nombre</Label>
                    <Input placeholder="Ej: Cafetería Norte" />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Input placeholder="cafetería, biblioteca, sala, baño" />
                  </div>
                  <div>
                    <Label>Latitud</Label>
                    <Input type="number" placeholder="-33.4983" />
                  </div>
                  <div>
                    <Label>Longitud</Label>
                    <Input type="number" placeholder="-70.6136" />
                  </div>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea placeholder="Describe el lugar..." />
                </div>
                <div>
                  <Label>Etiquetas (separadas por coma)</Label>
                  <Input placeholder="con enchufes, acepta JUNAEB, wifi rápido" />
                </div>
                <Button onClick={handleAddLugar}>Agregar Lugar</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lugares Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockLugares.map((lugar) => (
                    <div
                      key={lugar.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{lugar.nombre}</p>
                        <p className="text-sm text-muted-foreground">{lugar.tipo}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("Lugar", lugar.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Eventos Tab */}
        {activeTab === "eventos" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Agregar Nuevo Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Título</Label>
                    <Input placeholder="Ej: Feria de Ciencias" />
                  </div>
                  <div>
                    <Label>Facultad</Label>
                    <Input placeholder="Ej: Ingeniería" />
                  </div>
                  <div>
                    <Label>Lugar</Label>
                    <Input placeholder="Ej: Auditorio Central" />
                  </div>
                  <div>
                    <Label>Fecha</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Hora</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea placeholder="Describe el evento..." />
                </div>
                <Button onClick={handleAddEvento}>Agregar Evento</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eventos Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockEventos.map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{evento.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          {evento.facultad} - {evento.fecha}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("Evento", evento.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
