// app/(onboarding)/step3.tsx

import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step3() {
  const router = useRouter();

    const handleFinish = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/');
    };

    async function handleSkip() {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/');
        return null;
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Calendário de Agendamento</Text>
      <Text style={styles.description}>
        Essa tela permite visualizar os agendamentos por data no calendário.
        Dias com compromissos aparecem marcados com um ponto vermelho.
      </Text>
      <Text style={styles.description}>
        Selecione um dia para ver os detalhes dos agendamentos.
        Você pode editar ou cancelar reservas diretamente pela lista.
      </Text>
      <Text style={styles.description}>
        Use o botão "+ Nova Reserva" para adicionar uma nova reserva na data selecionada.
      </Text>

      <TouchableOpacity onPress={handleFinish} style={styles.button}>
        <Text style={styles.buttonText}>Finalizar e Ir para Agenda</Text>
      </TouchableOpacity>
       <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#7209b7',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#7209b7',
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 12, 
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: { marginTop: 16, alignItems: 'center' },
  skipText: { color: '#7209b7', fontSize: 16, textDecorationLine: 'underline' },
});
