import { db } from "@/firebase";
import { collection, doc, getDocs, query, where } from "firebase/firestore";

  export async function getReservaRefById(idInterno: string) {
    const reservasCol = collection(db, "reservas");
    const q = query(reservasCol, where("id", "==", idInterno));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    const documentId = docSnap.id;
    return doc(db, "reservas", documentId);
}