import '@/config/calendarLocale';
import { db } from '@/firebase';
import { Ionicons } from '@expo/vector-icons'; // para o ícone de engrenagem
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AgendaScreen() {
  const [selected, setSelected] = React.useState('');
  const [reservas, setReservas] = React.useState<any[]>([]);
  const router = useRouter();

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

  // Filtra reservas do dia selecionado
  const reservasDoDia = reservas.filter(r => r.data === selected);

  // Pega a próxima reserva com status confirmado ou pendente
  const proximaReserva = React.useMemo(() => {
    // ordenar por data crescente
    const futuras = reservas
      .filter(r => new Date(r.data) >= new Date())
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    return futuras.length > 0 ? futuras[0] : null;
  }, [reservas]);

  // Próximas datas com status livre ou ocupado (simples)
  const proximasDatas = React.useMemo(() => {
    // criar lista dos próximos 3 dias a partir de hoje (exemplo fixo)
    const dias = [];
    const hoje = new Date();
    for (let i = 1; i <= 3; i++) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() + i);
      const dataStr = d.toISOString().slice(0, 10);
      const reservaNoDia = reservas.find(r => r.data === dataStr);
      dias.push({
        data: d,
        status: reservaNoDia ? 'Ocupado' : 'Livre',
      });
    }
    return dias;
  }, [reservas]);

  const formatarData = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  const handleAddReservation = () => {
    if (!selected) return;
    router.push({ pathname: '/new-reservation', params: { data: selected } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Espaço de Lazer</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => {/* ação de configurações */}}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {proximaReserva ? (
        <View style={styles.proximaReservaCard}>
          <Text style={styles.labelPequeno}>Próxima reserva</Text>
          <View style={styles.proximaReservaRow}>
            <View>
              <Text style={styles.nomeReserva}>{proximaReserva.nome}</Text>
              <Text style={styles.dataReserva}>{formatarData(new Date(proximaReserva.data))} de {new Date(proximaReserva.data).getFullYear()}</Text>
            </View>
            <View style={styles.iconCalendar}>
              <Text style={styles.iconCalendarText}>
                {new Date(proximaReserva.data).getDate()}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.proximaReservaCard, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={{ color: '#666' }}>Sem reservas futuras</Text>
        </View>
      )}

      <TouchableOpacity style={styles.novaReservaButton} onPress={handleAddReservation} disabled={!selected}>
        <Text style={styles.novaReservaText}>+ Nova Reserva</Text>
      </TouchableOpacity>

      <View style={styles.proximasDatasCard}>
        <Text style={styles.labelPequeno}>Próximas datas</Text>
        {proximasDatas.map((item, index) => (
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
  title: { fontWeight: 'bold', fontSize: 28 },
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
  labelPequeno: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  proximaReservaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  novaReservaButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  novaReservaText: {
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
