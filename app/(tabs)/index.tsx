import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import '@/config/calendarLocale';
import { db } from '@/firebase';
import { getTodayFormatted } from '@/utils/getTodayFormatted';
import { normalizeDate } from '@/utils/normalizeDate';
import { formatarData, parseLocalDate } from '@/utils/parseLocalDate';
import { today } from '@/utils/todayDate';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AgendaScreen() {
  const [selected] = React.useState(getTodayFormatted());
  const [reservas, setReservas] = React.useState<any[]>([]);
  const router = useRouter();

  const todaySchedules = React.useMemo(() => {
    return reservas.filter(r => {
      const reservaDate = parseLocalDate(r.data);
      return normalizeDate(reservaDate).getTime() === today.getTime();
    });
  }, [reservas]);

  const nextDates = React.useMemo(() => {
    const dias = [];
    for (let i = 1; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dataStr = d.toISOString().slice(0, 10);
     const reservationsOnTheDay = reservas.filter(r => r.data === dataStr && r.status !== 'cancelado' && r.status !== 'expirado'); 
      dias.push({
        data: d,
        status: reservationsOnTheDay.length > 0 ? 'Ocupado' : 'Livre',
      });
    }
    return dias;
  }, [reservas]);

  const handleAddReservation = () => {
    console.log('selected', selected);
     if (!selected) return;
    return router.push({ pathname: '/newReservation', params: { data: selected } });
  };

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
      <View style={styles.header}>
        <TitleSubtitle title="Recanto Suzuki" />
        <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

    {todaySchedules.length > 0 ? (
      <View style={styles.proximaReservaCard}>
        <TitleSubtitle subtitle="Agendamentos para Hoje" />
        {todaySchedules.map((reserva, index) => (
          <View style={styles.proximaReservaRow} key={reserva.id ?? index}>
            <View>
              <Text style={styles.nomeReserva}>{reserva.nome}</Text>
              <Text style={styles.dataReserva}>
                {formatarData(parseLocalDate(reserva.data))} de {parseLocalDate(reserva.data).getFullYear()}
              </Text>
            </View>
            <View style={styles.iconCalendar}>
              <Text style={styles.iconCalendarText}>
                {parseLocalDate(reserva.data).getDate()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    ) : (
      <View style={[styles.proximaReservaCard, { justifyContent: 'center', alignItems: 'center' }]}>
         <TitleSubtitle subtitle="Nenhum agendamento para hoje" />
      </View>
    )}

      <CreateReservationButton
        title="+ Nova Reserva"
        onPress={handleAddReservation}
        disabled={false}
      />

      <View style={styles.proximasDatasCard}>
        <TitleSubtitle subtitle="Próximas datas:" />
        {nextDates.map((item, index) => (
          <View style={styles.dataStatusRow} key={index}>
            <Text>{formatarData(item.data)}</Text>
            <Text style={{ color: item.status === 'Livre' ? 'green' : 'red' }}>{item.status}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 54 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  settingsButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
  },
  proximaReservaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  proximaReservaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  nomeReserva: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  dataReserva: {
    color: '#666',
    marginTop: 4,
  },
  iconCalendar: {
    backgroundColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCalendarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  proximasDatasCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dataStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
});
