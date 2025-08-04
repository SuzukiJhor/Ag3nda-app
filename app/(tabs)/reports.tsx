import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import { useAuth } from '@/context/AuthProvider';
import { listenReservasByUid } from '@/services/listenReservationByUserId';
import { normalizeDate } from '@/utils/normalizeDate';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';


export default function RelatoriosScreen() {
  const [reservas, setReservas] = React.useState<any[]>([]);
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) return;
      const unsubscribe = listenReservasByUid(user.uid, (data) => {
      setReservas(data);
    });
    
    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.container}>
      <TitleSubtitle title="Atendimentos" />
      <FlatList
        data={reservas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cliente}>{item.nome}</Text>
            <Text style={styles.info}>{normalizeDate(new Date(item.data)).toLocaleDateString()}</Text>
            <Text style={styles.servico}>{item.telefone}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum atendimento registrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 32 },
  card: { backgroundColor: '#f1f1f1', padding: 16, borderRadius: 8, marginBottom: 12, marginTop: 12 },
  cliente: { fontSize: 18, fontWeight: '600' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  servico: { fontSize: 16, color: '#007AFF', marginTop: 4 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 32 },
});