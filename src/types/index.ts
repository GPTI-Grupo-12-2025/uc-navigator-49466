export type Lugar = {
  id: string;
  nombre: string;
  tipo: "cafetería" | "biblioteca" | "sala" | "baño";
  etiquetas: string[];
  lat: number;
  lng: number;
  rating: number;
  reseñas: Reseña[];
  alertas?: Alerta[];
  descripcion?: string;
  horario?: string;
};

export type Reseña = {
  id: string;
  usuario: string;
  texto: string;
  fecha: string;
  rating: number;
};

export type Alerta = {
  id: string;
  texto: string;
  tipo: "lleno" | "mantenimiento" | "cerrado";
  fecha: string;
  expira: string;
};

export type Evento = {
  id: string;
  titulo: string;
  facultad: string;
  lugar: string;
  fecha: string;
  hora: string;
  descripcion: string;
  inscritos: number;
  imagen?: string;
};

export type Usuario = {
  id: string;
  email: string;
  nombre: string;
  isAdmin: boolean;
};

export type UCPuntos = {
  userId: string;
  nombre: string;
  puntos: number;
};

export type Premio = {
  id: string;
  nombre: string;
  descripcion: string;
  costo: number;
  imagen?: string;
};

export type LugarEco = {
  id: string;
  nombre: string;
  tipo: "reciclaje" | "agua" | "zona-verde";
  lat: number;
  lng: number;
  descripcion?: string;
};
