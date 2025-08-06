import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import Loading from '@/components/Loading';
import '@/config/calendarLocale';
import { useReservation } from '@/context/ReservationProvider';
import { getReservaRefById } from '@/services/getReservationRefById';
import { useRouter } from 'expo-router';
import { updateDoc } from 'firebase/firestore';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function AgendaScreen() {
  const [selected, setSelected] = React.useState('');
  const {reservations: reservation, loading} = useReservation();
  const router = useRouter();
  const reservasDoDia = reservation.filter(r => r.data === selected);

  const markedDates = React.useMemo(() => {
    const result: Record<string, {
      marked?: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
    }> = {};

    reservation.forEach(r => {
      result[r.data] = { marked: true, dotColor: 'red' };
    });

    if (selected) {
      result[selected] = {
        ...(result[selected] || {}),
        selected: true,
        selectedColor: '#7209b7',
      };
    }

    return result;
  }, [reservation, selected]);

  const getStatusStyle = (status: string) => {
    if (status === 'pendente') return styles.cardPendente;
    if (status === 'confirmado') return styles.cardConfirmada;
    if (status === 'cancelado') return styles.cardCancelada;
    return styles.card;
  };

  const handleCancelReservation = async (id: string) => {
    if (!id) return;

    try {
      const reservationRef = await getReservaRefById(id);
      if (!reservationRef) {
        Alert.alert("Reserva não encontrada com esse ID interno.");
        return;
      }
      await updateDoc(reservationRef, { status: "cancelado" });
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err);
      Alert.alert("Erro ao cancelar reserva!");
    }
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

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={day => setSelected(day.dateString)}
      />

      <TitleSubtitle subtitle="Agendamentos do dia: " />
      <FlatList
        data={reservasDoDia}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, getStatusStyle(item.status), styles.cardRow]}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => handleEditReservation(item)}
            >
              <Text>{item.nome}</Text>
              <Text>{item.telefone}</Text>
              <Text>{item.status}</Text>
            </TouchableOpacity>

          {item.status !== 'cancelado' && (
              <TouchableOpacity 
                onPress={() => handleCancelReservation(item.id)} 
                style={styles.buttonCancel}
              >
                <Text style={{ color: 'red', fontSize: 14 }}>Cancelar</Text>
              </TouchableOpacity>
            )}

          </View>
        )}

        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum compromisso nesse dia</Text>
        }
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 54,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardPendente: {
    backgroundColor: '#fffbe5',
    borderColor: '#ffe066',
    borderWidth: 1,
  },
  cardConfirmada: {
    backgroundColor: '#e6ffed',
    borderColor: '#38d39f',
    borderWidth: 1,
  },
  cardCancelada: {
    backgroundColor: '#ffe6e6',
    borderColor: '#ff4d4d',
    borderWidth: 1,
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  buttonCancel: {
    backgroundColor: '#f8d7da',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
