import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NewReservationScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState('');

  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState('');
  const [status, setStatus] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const salvarReserva = () => {
    const novaReserva = {
      id: Date.now().toString(),
      data,
      cliente,
      servico,
      status,
      observacoes,
      nome,
      email,
      telefone,
      documento,
    };

    console.log('Nova reserva:', novaReserva);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Data da reserva: {data}</Text>

      {/* Dados pessoais do cliente */}
      <Text style={styles.sectionTitle}>Dados do Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Documento (ex: CPF)"
        value={documento}
        onChangeText={setDocumento}
      />

      {/* Informações da reserva */}
      <Text style={styles.sectionTitle}>Informações da Reserva</Text>
      <TextInput
        style={styles.input}
        placeholder="Serviço"
        value={servico}
        onChangeText={setServico}
      />
      <TextInput
        style={styles.input}
        placeholder="Status (ex: confirmada)"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={observacoes}
        onChangeText={setObservacoes}
      />

      <Button title="Salvar reserva" onPress={salvarReserva} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 54,
    flexGrow: 1,
  },
  label: { fontWeight: 'bold', marginBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
});
