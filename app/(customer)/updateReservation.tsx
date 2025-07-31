import DangerButton from '@/components/button/ButtonCancelReservation';
import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { db } from '@/firebase';
import { useHandleGoBack } from '@/hooks/useHandleGoBack';
import { useLocalSearchParams } from 'expo-router';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FormData, statusOptions } from '../types/form';

export default function UpdateClientScreen() {
  const handleGoBack = useHandleGoBack({ fallbackRoute: "/(tabs)" });
  const params = useLocalSearchParams();
  const getParamString = (param: string | string[] | undefined) => {
    if (Array.isArray(param)) return param[0] || '';
    return param || '';
  };
   
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

  async function getReservaRefById(idInterno: string) {
    const reservasCol = collection(db, "reservas");
    const q = query(reservasCol, where("id", "==", idInterno));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    const documentId = docSnap.id;
    return doc(db, "reservas", documentId);
  }

  
  
  const handleCancelReservation = async () => {
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const idInterno = (rawId || "").trim();

    try {
      const reservaRef = await getReservaRefById(idInterno);
      if (!reservaRef) {
        alert("Reserva não encontrada com esse ID interno.");
        return;
      }
      await updateDoc(reservaRef, { status: "cancelado" });
      handleGoBack();
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err);
      alert("Erro ao cancelar reserva!");
    }
  };

  const handleUpdate = async () => {
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const idInterno = (rawId || "").trim();

    try {
      const reservaRef = await getReservaRefById(idInterno);
      if (!reservaRef) {
        alert("Reserva não encontrada com esse ID interno.");
        return;
      }
      await updateDoc(reservaRef, { ...form });
      alert("Reserva atualizada com sucesso!");
      handleGoBack();
    } catch (err) {
      console.error("Erro ao atualizar reserva:", err);
      alert("Erro ao atualizar reserva!");
    }
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

    <CreateReservationButton
        title="Salvar alterações"
        onPress={handleUpdate}
        disabled={false}
    />

    <View style={{ height: 8 }} />

    <DangerButton
        title="Cancelar reserva"
        onPress={handleCancelReservation}
        disabled={false}
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