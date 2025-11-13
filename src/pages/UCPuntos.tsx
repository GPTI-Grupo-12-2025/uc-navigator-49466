import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPuntos, mockPremios } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trophy, Gift, Star, Sparkles } from "lucide-react";

const UCPuntos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userPoints] = useState(850); // Puntos del usuario actual (Javier)
  const sortedPuntos = [...mockPuntos].sort((a, b) => b.puntos - a.puntos);

  const handleCanjear = (premio: typeof mockPremios[0]) => {
    if (userPoints < premio.costo) {
      toast({
        title: "Puntos insuficientes",
        description: `Necesitas ${premio.costo - userPoints} puntos más`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "¡Premio canjeado!",
      description: `Has recibido un cupón para: ${premio.nombre}`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate("/home")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              UCPuntos
            </h1>
          </div>
          <div className="bg-primary-foreground/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tus puntos</p>
                <p className="text-3xl font-bold">{userPoints}</p>
              </div>
              <Trophy className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="premios" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="premios">Premios</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
          </TabsList>

          {/* Premios */}
          <TabsContent value="premios" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Premios Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockPremios.map((premio) => {
                  const canAfford = userPoints >= premio.costo;
                  return (
                    <div
                      key={premio.id}
                      className="border border-border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {premio.nombre}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {premio.descripcion}
                          </p>
                        </div>
                        <Badge
                          variant={canAfford ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {premio.costo} pts
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCanjear(premio)}
                        disabled={!canAfford}
                        className="w-full"
                      >
                        {canAfford ? "Canjear" : "Puntos insuficientes"}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Info sobre cómo ganar puntos */}
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-4">
                <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  ¿Cómo ganar puntos?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Escribe una reseña: +50 puntos</li>
                  <li>• Reporta una alerta: +30 puntos</li>
                  <li>• Califica un lugar: +20 puntos</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ranking */}
          <TabsContent value="ranking" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Ranking de Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sortedPuntos.map((user, index) => {
                  const isCurrentUser = user.userId === "1"; // Javier
                  const getRankIcon = () => {
                    if (index === 0) return "🥇";
                    if (index === 1) return "🥈";
                    if (index === 2) return "🥉";
                    return `${index + 1}.`;
                  };

                  return (
                    <div
                      key={user.userId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isCurrentUser
                          ? "bg-accent/10 border-2 border-accent"
                          : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold w-8">
                          {getRankIcon()}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.nombre}
                            {isCurrentUser && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Tú
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-accent">
                          {user.puntos}
                        </p>
                        <p className="text-xs text-muted-foreground">puntos</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UCPuntos;
