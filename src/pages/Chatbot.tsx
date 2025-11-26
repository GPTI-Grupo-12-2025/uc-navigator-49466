import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { mockLugares } from "@/data/mockData";
import { ArrowLeft, Send, Bot, User, MapPin } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  lugares?: Array<{ id: string; nombre: string; lat: number; lng: number }>;
};

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu asistente UC. ¿En qué puedo ayudarte? Puedo recomendarte lugares para comer, estudiar, o ayudarte con información del campus.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const getBotResponse = (userMessage: string): { text: string; lugares: Array<{ id: string; nombre: string; lat: number; lng: number }> } => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("junaeb") || lowerMessage.includes("comer")) {
      const lugaresJunaeb = mockLugares.filter((l) =>
        l.etiquetas.includes("acepta JUNAEB")
      );
      return {
        text: `Te recomiendo estos lugares que aceptan JUNAEB: ${lugaresJunaeb
          .map((l) => l.nombre)
          .join(", ")}. Haz clic en cualquier lugar para verlo en el mapa.`,
        lugares: lugaresJunaeb.map(l => ({ id: l.id, nombre: l.nombre, lat: l.lat, lng: l.lng }))
      };
    }

    if (lowerMessage.includes("estudiar") || lowerMessage.includes("biblioteca")) {
      const lugaresEstudio = mockLugares.filter(
        (l) => l.tipo === "biblioteca" || l.tipo === "sala"
      );
      return {
        text: `Para estudiar te recomiendo: ${lugaresEstudio
          .map((l) => l.nombre)
          .join(", ")}. Todos tienen enchufes y wifi. Haz clic en cualquier lugar para verlo en el mapa.`,
        lugares: lugaresEstudio.map(l => ({ id: l.id, nombre: l.nombre, lat: l.lat, lng: l.lng }))
      };
    }

    if (lowerMessage.includes("vegano") || lowerMessage.includes("vegetariano")) {
      const lugaresVeganos = mockLugares.filter((l) =>
        l.etiquetas.includes("opción vegana")
      );
      return {
        text: `Lugares con opciones veganas: ${lugaresVeganos
          .map((l) => l.nombre)
          .join(", ")}. Haz clic en cualquier lugar para verlo en el mapa.`,
        lugares: lugaresVeganos.map(l => ({ id: l.id, nombre: l.nombre, lat: l.lat, lng: l.lng }))
      };
    }

    if (lowerMessage.includes("baño")) {
      const banos = mockLugares.filter((l) => l.tipo === "baño");
      return {
        text: `Los baños más cercanos son: ${banos.map((l) => l.nombre).join(", ")}. Haz clic en cualquier baño para verlo en el mapa.`,
        lugares: banos.map(l => ({ id: l.id, nombre: l.nombre, lat: l.lat, lng: l.lng }))
      };
    }

    if (
      lowerMessage.includes("hola") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hello")
    ) {
      return {
        text: "¡Hola! ¿En qué puedo ayudarte hoy? Puedo ayudarte a encontrar lugares para comer, estudiar, baños, o información sobre eventos.",
        lugares: []
      };
    }

    return {
      text: "Puedo ayudarte con: lugares para comer con JUNAEB, espacios para estudiar, opciones veganas, baños accesibles, y más. ¿Qué necesitas?",
      lugares: []
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const response = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        lugares: response.lugares,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6" />
            <h1 className="text-xl font-bold">Asistente UC</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-y-auto">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.sender === "user" ? "bg-accent" : "bg-primary"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-4 h-4 text-accent-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <Card
                className={`p-3 max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.lugares && message.lugares.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.lugares.map((lugar) => (
                      <Button
                        key={lugar.id}
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/mapa", { state: { focusLocation: lugar } })}
                        className="text-xs"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {lugar.nombre}
                      </Button>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-card p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
