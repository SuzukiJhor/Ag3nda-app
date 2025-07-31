import { db } from '@/firebase';
import { normalizeDate } from '@/utils/normalizeDate';
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';


export default function RelatoriosScreen() {
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
      <Text style={styles.title}>Relatórios de Atendimentos</Text>
      <FlatList
        data={reservas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cliente}>{item.cliente}</Text>
            <Text style={styles.info}>{normalizeDate(new Date(item.data)).toLocaleDateString()}</Text>
            <Text style={styles.servico}>{item.servico}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum atendimento registrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#f1f1f1', padding: 16, borderRadius: 8, marginBottom: 12 },
  cliente: { fontSize: 18, fontWeight: '600' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  servico: { fontSize: 16, color: '#007AFF', marginTop: 4 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 32 },
});