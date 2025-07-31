import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import '@/config/calendarLocale';
import { db } from '@/firebase';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function AgendaScreen() {
  const [selected, setSelected] = React.useState('');
  const [reservas, setReservas] = React.useState<any[]>([]);
  const router = useRouter();
  const reservasDoDia = reservas.filter(r => r.data === selected);

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

  const markedDates = React.useMemo(() => {
    const result: Record<string, { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string }> = {};
    reservas.forEach(r => {
      result[r.data] = { marked: true, dotColor: 'red' };
    });
    if (selected) {
      result[selected] = { ...(result[selected] || {}), selected: true, selectedColor: '#007AFF' };
    }
    return result;
  }, [reservas, selected]);

  const getStatusStyle = (status: string) => {
    if (status === 'pendente') return styles.cardPendente;
    if (status === 'confirmado') return styles.cardConfirmada;
    if (status === 'cancelado') return styles.cardCancelada;
    return styles.card;
  };

  const handleEditReservation = (item: any) => {
  router.push({
    pathname: '/updateReservation',
    params: { ...item }
  });
};

  const handleAddReservation = () => {
    if (!selected) return;
    return router.push({ pathname: '/newReservation', params: { data: selected } });
  };


  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={day => setSelected(day.dateString)}
      />
      
      <TitleSubtitle subtitle="Agendamentos do dia"/>

       <FlatList
          data={reservasDoDia}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEditReservation(item)}>
              <View style={[styles.card, getStatusStyle(item.status)]}>
                <Text>{item.nome}</Text>
                <Text>{item.telefone}</Text>
                <Text>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum compromisso nesse dia</Text>}
        />
      <CreateReservationButton
        title="+ Nova Reserva"
        onPress={handleAddReservation}
        disabled={!selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 54 },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  card: { padding: 12, borderRadius: 8, marginBottom: 8 },
  cardPendente: { backgroundColor: '#fffbe5', borderColor: '#ffe066', borderWidth: 1 },
  cardConfirmada: { backgroundColor: '#e6ffed', borderColor: '#38d39f', borderWidth: 1 },
  cardCancelada: { backgroundColor: '#ffe6e6', borderColor: '#ff4d4d', borderWidth: 1 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 24 },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
});
