import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LugarDetail from "./pages/LugarDetail";
import Eventos from "./pages/Eventos";
import Chatbot from "./pages/Chatbot";
import Admin from "./pages/Admin";
import Mapa from "./pages/Mapa";
import UCPuntos from "./pages/UCPuntos";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/lugar/:id"
      element={
        <ProtectedRoute>
          <LugarDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/eventos"
      element={
        <ProtectedRoute>
          <Eventos />
        </ProtectedRoute>
      }
    />
    <Route
      path="/chatbot"
      element={
        <ProtectedRoute>
          <Chatbot />
        </ProtectedRoute>
      }
    />
    <Route
      path="/mapa"
      element={
        <ProtectedRoute>
          <Mapa />
        </ProtectedRoute>
      }
    />
    <Route
      path="/ucpuntos"
      element={
        <ProtectedRoute>
          <UCPuntos />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
