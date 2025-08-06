import { listenReservasByUid } from '@/services/listenReservationByUserId';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

type Reservation = {
  id: string;
  userId: string;
  data: string;
  nome: string;
  servico: string;
  status: string;
  [key: string]: any;
};

type ReservationContextType = {
  reservations: Reservation[];
  loading: boolean;
};

const ReservationContext = createContext<ReservationContextType>({
  reservations: [],
  loading: true,
});

export const ReservationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = listenReservasByUid(user.uid, (data) => {
      setReservations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);


  return (
    <ReservationContext.Provider value={{ reservations, loading }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);
