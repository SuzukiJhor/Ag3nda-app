import '@/config/calendarLocale';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { reservas as reservasMock } from '../../mock/reservation';

export default function AgendaScreen() {
  const [selected, setSelected] = React.useState('');
  const [reservas] = React.useState(reservasMock);
  const router = useRouter();

  const reservasDoDia = reservas.filter(r => r.data === selected);

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
    if (status === 'confirmada') return styles.cardConfirmada;
    if (status === 'cancelada') return styles.cardCancelada;
    return styles.card;
  };

  const handleAddReservation = async () => {
    if (!selected) return;
    return router.push({ pathname: '/new-reservation', params: { data: selected } });
  };


  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={day => setSelected(day.dateString)}
      />
      <Text style={styles.label}>Agendamentos do dia:</Text>

       <FlatList
        data={reservasDoDia}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, getStatusStyle(item.status)]}>
            <Text>{item.nome}</Text>
            <Text>{item.telefone}</Text>
            <Text>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum compromisso nesse dia</Text>}
      />

      <Button style={styles.buttonText} title="+ Nova Reserva" onPress={handleAddReservation} disabled={!selected} />
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
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
