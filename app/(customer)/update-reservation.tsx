import { db } from '@/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type FormData = {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  servico: string;
  status: string;
  observacoes: string;
};

export default function UpdateClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const getParamString = (param: string | string[] | undefined) => {
    if (Array.isArray(param)) return param[0] || '';
    return param || '';
  };

    const statusOptions: FormData['status'][] = [
    'pendente',
    'confirmado',
    'cancelado',
    'expirado',
    ];
   
  const [form, setForm] = React.useState<FormData>({
    nome: getParamString(params.nome),
    email: getParamString(params.email),
    telefone: getParamString(params.telefone),
    documento: getParamString(params.documento),
    servico: getParamString(params.servico),
    status: getParamString(params.status),
    observacoes: getParamString(params.observacoes),
  });

  const onChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

    const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

    const handleCancelReservation = async () => {
      if (!params.id) {
        alert('ID da reserva não encontrado!');
        return;
      }
        const ref = doc(db, 'reservas', String(params.id));
        console.log('Tentando buscar reserva:', params.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          alert('Reserva não encontrada!');
          return;
        }
      try {
        await updateDoc(ref, { ...form, status: 'cancelado' });
        router.back();
      } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        alert('Erro ao cancelar reserva!');
      }
    };

    const handleUpdate = async () => {
    // Exemplo para atualizar no Firestore:
    // const ref = doc(db, 'reservas', id as string);
    // await updateDoc(ref, form);
    console.log(form);
    // Volta para a tela anterior ou lista de reservas
    // router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Data da reserva: {params.data}</Text>

      <Text style={styles.sectionTitle}>Dados do Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={form.nome}
        onChangeText={value => onChange('nome', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={value => onChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={form.telefone}
        onChangeText={value => onChange('telefone', value)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Documento (ex: CPF)"
        value={form.documento}
        onChangeText={value => onChange('documento', value)}
      />

      <Text style={styles.sectionTitle}>Informações da Reserva</Text>
      <TextInput
        style={styles.input}
        placeholder="Serviço"
        value={form.servico}
        onChangeText={value => onChange('servico', value)}
      />

      <Text style={styles.sectionTitle}>Status</Text>
      <View style={styles.radioGroup}>
        {statusOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.radioButton}
            onPress={() => onChange('status', option)}
          >
            <View style={styles.radioCircle}>
              {form.status === option && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.radioLabel}>{capitalize(option)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={form.observacoes}
        onChangeText={value => onChange('observacoes', value)}
      />

      <Button title="Salvar alterações" onPress={handleUpdate} />
      <View style={{ height: 16 }} />
      <Button
        title="Cancelar reserva"
        color="#ff4d4d"
        onPress={handleCancelReservation}
        />
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
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
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
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  radioLabel: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
});