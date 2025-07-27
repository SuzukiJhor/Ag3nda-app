import React from 'react';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { reservas as reservasMock } from '../mock/reservation';
import '../config/calendarLocale';

export default function AgendaScreen() {
  const [selected, setSelected] = React.useState('');
  const [reservas, setReservas] = React.useState(reservasMock);

  const reservasDoDia = reservas.filter(r => r.data === selected);

  const markedDates = React.useMemo(() => {
    const result: Record<string, { marked: boolean; dotColor: string }> = {};
    reservas.forEach(r => {
      result[r.data] = { marked: true, dotColor: 'red' };
    });
    if (selected) {
      result[selected] = { ...(result[selected] || {}), selected: true, selectedColor: '#007AFF' };
    }
    return result;
  }, [reservas, selected]);

  const handleAdicionarReserva = () => {
    if (!selected) return;

    const novaReserva = {
      id: Date.now().toString(), 
      data: selected,
      cliente: 'Novo Cliente',
      servico: 'Serviço Padrão',
      status: 'pendente',
      observacoes: '',
      nome: 'Nome Exemplo',
      email: 'email@example.com',
      telefone: '(00) 00000-0000',
      documento: '000.000.000-00'
    };

    setReservas(prev => [...prev, novaReserva]);
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={day => setSelected(day.dateString)}
      />
      <Text style={styles.label}>Compromissos do dia:</Text>

      <FlatList
        data={reservasDoDia}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.cliente}</Text>
            <Text>{item.servico}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum compromisso nesse dia</Text>}
      />

      <Button style={styles.buttonText} title="+ Nova Reserva" onPress={handleAdicionarReserva} disabled={!selected} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 54 },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  card: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 8, marginBottom: 8 },
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
