import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Step2() {
  const router = useRouter();

  function handleNextStep() {
      router.push('/step3')
      return;
  }

  async function handleSkip() {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/');
      return;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Aqui você encontra todos os agendamentos do dia atual e também os próximos 7 dias.
      </Text>

      <View style={styles.card}>
        <Ionicons name="calendar-outline" size={40} color="#7209b7" />
        <Text style={styles.cardText}>
          • Visualize agendamentos do dia{'\n'}
          • Consulte disponibilidade dos próximos dias{'\n'}
          • Toque em uma reserva para editar
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Próximo</Text>
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
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },

  logo: {
    width: 160,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7209b7',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    color: '#403D39',
  },

  card: {
    backgroundColor: '#f3f0ff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 24,
    alignItems: 'center',
  },

  cardText: {
    marginTop: 12,
    fontSize: 16,
    color: '#403D39',
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#7209b7',
    padding: 14,
    borderRadius: 12,
    paddingHorizontal: 45,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  skipButton: {
    marginTop: 16,
    alignItems: 'center',
  },

  skipText: {
    color: '#7209b7',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

