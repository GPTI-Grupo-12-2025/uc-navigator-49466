import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Premio } from "@/types";

interface Cupon {
  id: string;
  premio: Premio;
  fechaCanje: string;
}

interface PointsContextType {
  points: number;
  cupones: Cupon[];
  addPoints: (amount: number, reason: string) => void;
  redeemPrize: (premio: Premio) => boolean;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [cupones, setCupones] = useState<Cupon[]>([]);

  // Load user points from localStorage
  useEffect(() => {
    if (user) {
      const savedPoints = localStorage.getItem(`points_${user.id}`);
      const savedCupones = localStorage.getItem(`cupones_${user.id}`);
      
      if (savedPoints) {
        setPoints(parseInt(savedPoints));
      } else {
        // Default points for new users
        setPoints(850);
      }
      
      if (savedCupones) {
        setCupones(JSON.parse(savedCupones));
      }
    } else {
      setPoints(0);
      setCupones([]);
    }
  }, [user]);

  // Save points to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`points_${user.id}`, points.toString());
    }
  }, [points, user]);

  // Save cupones to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cupones_${user.id}`, JSON.stringify(cupones));
    }
  }, [cupones, user]);

  const addPoints = (amount: number, reason: string) => {
    setPoints(prev => prev + amount);
  };

  const redeemPrize = (premio: Premio): boolean => {
    if (points < premio.costo) {
      return false;
    }

    setPoints(prev => prev - premio.costo);
    
    const newCupon: Cupon = {
      id: `cupon_${Date.now()}`,
      premio,
      fechaCanje: new Date().toISOString(),
    };
    
    setCupones(prev => [...prev, newCupon]);
    return true;
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        cupones,
        addPoints,
        redeemPrize,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
};
