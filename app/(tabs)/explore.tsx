import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import { db } from '@/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function ClientesScreen() {
    const [reservas, setReservas] = React.useState<any[]>([]);
  
    React.useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'reservas'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservas(data);
        });
  
      return () => unsubscribe();
    }, []);

  return (
    <View style={styles.container}>
      <TitleSubtitle title="Reservas"/>
      <FlatList
        data={reservas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.info}>{item.telefone}</Text>
            <Text style={styles.info}>{item.email}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum cliente cadastrado.</Text>}
      />
  
       <CreateReservationButton
        title="+ Novo Cliente"
        onPress={() => console.log('clicou')}
        disabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 24 },
  card: { backgroundColor: '#f1f1f1', padding: 16, borderRadius: 8, marginBottom: 12 },
  nome: { fontSize: 18, fontWeight: '600' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 32 },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});