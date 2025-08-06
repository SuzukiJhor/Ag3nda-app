import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import Loading from '@/components/Loading';
import '@/config/calendarLocale';
import { useAuth } from '@/context/AuthProvider';
import { useReservation } from '@/context/ReservationProvider';
import { auth } from '@/firebase';
import { getTodayFormatted } from '@/utils/getTodayFormatted';
import { normalizeDate } from '@/utils/normalizeDate';
import { formatarData, parseLocalDate } from '@/utils/parseLocalDate';
import { getStatusColor } from '@/utils/statusColors';
import { today } from '@/utils/todayDate';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import logo from '../../assets/images/logo.png';

export default function AgendaScreen() {
  const [onboarding, setOnboarding] = React.useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = React.useState(true);
  const [selected] = React.useState(getTodayFormatted());
  const {reservations: reservation, loading} = useReservation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const todaySchedules = React.useMemo(() => {
    return reservation.filter(r => {
      const reservaDate = parseLocalDate(r.data);
      return normalizeDate(reservaDate).getTime() === today.getTime();
    });
  }, [reservation]);

  const nextDates = React.useMemo(() => {
    const dias = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dataStr = d.toISOString().slice(0, 10);
     const reservationsOnTheDay = reservation.filter(r => r.data === dataStr && r.status !== 'cancelado' && r.status !== 'expirado'); 
      dias.push({
        data: d,
        status: reservationsOnTheDay.length > 0 ? 'Ocupado' : 'Livre',
      });
    }
    return dias;
  }, [reservation]);

  const handleEditReservation = (item: any) => {
    if (!item) return;
    router.push({
      pathname: '/updateReservation',
      params: { ...item }
    });
  };

  const handleAddReservation = () => {
     if (!selected) return;
    return router.push({ pathname: '/newReservation', params: { data: selected } });
  };

  const handleLogout = async () => {
     try {
      await signOut(auth);
      router.replace('/login');
       return null;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  React.useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        setOnboarding(hasSeen === 'true');
      } catch (err) {
        console.error('Erro ao verificar onboarding:', err);
        setOnboarding(false);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  if (!onboarding && !checkingOnboarding) {
    router.push('/step1');
    return null;
  }

  if (!user && !authLoading) {
    router.push('/login');
    return null;
  }

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Image
            source={logo}
            style={{ width: 180, height: 150, resizeMode: 'contain', alignSelf: 'flex-start' }}
          />
        <TouchableOpacity style={styles.settingsButton} onPress={() => {handleLogout()}}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

    {todaySchedules.length > 0 ? (
        <View style={styles.proximaReservaCard}>
          <TitleSubtitle subtitle="Agendamentos para Hoje" />
          {todaySchedules.map((reservation, index) => {
          let beltText = reservation.status?.toUpperCase() || 'INDEFINIDO';
          let beltColor = getStatusColor(reservation.status);

          return (
            <TouchableOpacity
              key={reservation.id ?? index}
              style={styles.proximaReservaRow}
              onPress={() => handleEditReservation(reservation)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.nomeReserva}>{reservation.nome}</Text>
                <Text style={styles.dataReserva}>
                  {formatarData(parseLocalDate(reservation.data))} de {parseLocalDate(reservation.data).getFullYear()}
                </Text>
                <View style={[styles.faixaCancelado, { backgroundColor: beltColor }]}>
                  <Text style={styles.textoCancelado}>{beltText}</Text>
                </View>
              </View>
              <View style={styles.iconCalendar}>
                <Text style={styles.iconCalendarText}>
                  {parseLocalDate(reservation.data).getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        </View>
      ) : (
        <View style={[styles.proximaReservaCard, { justifyContent: 'center', alignItems: 'center' }]}>
          <TitleSubtitle subtitle="Nenhum agendamento para hoje" />
          <TitleSubtitle title= {formatarData(new Date())} />
        </View>
      )}

    <TitleSubtitle subtitle="Próximas datas:" />
    <FlatList
      data={nextDates}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.dataStatusRow}>
          <Text>{formatarData(item.data)}</Text>
          <Text style={{ color: item.status === 'Livre' ? 'green' : 'red' }}>
            {item.status}
          </Text>
        </View>
      )}
    />
      
      <CreateReservationButton
        title="+ Nova Reserva"
        onPress={handleAddReservation}
        disabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  settingsButton: {
    backgroundColor: '#7209b7',
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
    color: '#403D39',
  },
  dataReserva: {
    color: '#252422',
    marginTop: 4,
  },
  iconCalendar: {
    backgroundColor: '#EB5E28',
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
  faixaCancelado: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  textoCancelado: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

});
