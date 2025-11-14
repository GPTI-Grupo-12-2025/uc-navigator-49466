import { useNavigate } from "react-router-dom";
import { mockPuntos, mockPremios } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trophy, Gift, Star, Sparkles, Ticket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePoints } from "@/contexts/PointsContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const UCPuntos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { points, cupones, redeemPrize } = usePoints();
  
  // Update current user's points in the ranking
  const updatedPuntos = mockPuntos.map(p => 
    p.nombre === user?.nombre ? { ...p, puntos: points } : p
  );
  const sortedPuntos = [...updatedPuntos].sort((a, b) => b.puntos - a.puntos);

  const handleCanjear = (premio: typeof mockPremios[0]) => {
    if (points < premio.costo) {
      toast({
        title: "Puntos insuficientes",
        description: `Necesitas ${premio.costo - points} puntos más`,
        variant: "destructive",
      });
      return;
    }

    const success = redeemPrize(premio);
    if (success) {
      toast({
        title: "¡Premio canjeado!",
        description: `Has recibido un cupón para: ${premio.nombre}`,
      });
    }
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
                <p className="text-3xl font-bold">{points}</p>
              </div>
              <Trophy className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="premios" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="premios">Premios</TabsTrigger>
            <TabsTrigger value="cupones">
              Mis Cupones
              {cupones.length > 0 && (
                <Badge variant="secondary" className="ml-2">{cupones.length}</Badge>
              )}
            </TabsTrigger>
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
                  const canAfford = points >= premio.costo;
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

          {/* Mis Cupones */}
          <TabsContent value="cupones" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Cupones Canjeados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cupones.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No has canjeado ningún cupón todavía
                  </p>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {cupones.map((cupon) => (
                        <div
                          key={cupon.id}
                          className="border border-accent/30 bg-accent/5 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">
                                {cupon.premio.nombre}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {cupon.premio.descripcion}
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              <Ticket className="w-3 h-3 mr-1" />
                              Cupón
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Canjeado: {new Date(cupon.fechaCanje).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
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
                {sortedPuntos.map((userRank, index) => {
                  const isCurrentUser = user?.nombre === userRank.nombre;
                  const getRankIcon = () => {
                    if (index === 0) return "🥇";
                    if (index === 1) return "🥈";
                    if (index === 2) return "🥉";
                    return `${index + 1}.`;
                  };

                  return (
                    <div
                      key={userRank.userId}
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
                            {userRank.nombre}
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
                          {isCurrentUser ? points : userRank.puntos}
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
