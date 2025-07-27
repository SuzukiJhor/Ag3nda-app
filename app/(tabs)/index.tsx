import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import '../config/calendarLocale';

const reservas = [
  { id: '1', data: '2025-07-27', cliente: 'Maria', servico: 'Consulta' },
  { id: '2', data: '2025-07-28', cliente: 'João', servico: 'Retorno' },
];

const markedDates = reservas.reduce<Record<string, { marked: boolean; dotColor: string }>>((acc, curr) => {
  acc[curr.data] = { marked: true, dotColor: 'red' };
  return acc;
}, {});

export default function AgendaScreen() {
  const [selected, setSelected] = useState('');

  const reservasDoDia = reservas.filter(r => r.data === selected);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={{
          ...markedDates,
          [selected]: { selected: true, selectedColor: '#007AFF' },
        }}
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
        ListEmptyComponent={<Text style={styles.empty}>Nenhum compromisso.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 54 },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  card: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 8, marginBottom: 8 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 24 },
});