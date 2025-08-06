import { db } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

/**
 * Escuta em tempo real as reservas de um usuário específico.
 * @param uid - ID do usuário autenticado
 * @param callback - Função chamada quando os dados são atualizados
 * @returns Função para cancelar a escuta (unsubscribe)
 */
export function listenReservasByUid(
  uid: string,
  callback: (reservas: any[]) => void
) {
  const reservasRef = collection(db, "reservas");
  const q = query(reservasRef, where("userId", "==", uid));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });

  return unsubscribe;
}
