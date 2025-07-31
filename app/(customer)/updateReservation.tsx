import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import { useHandleGoBack } from '@/hooks/useHandleGoBack';
import { getReservaRefById } from '@/utils/getReservationRefById';
import { normalizeDate } from '@/utils/normalizeDate';
import { useLocalSearchParams } from 'expo-router';
import { updateDoc } from 'firebase/firestore';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
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

  function validateForm() {
      if (
        !form.nome.trim() ||
        !form.email.trim() ||
        !form.telefone.trim() ||
        !form.documento.trim() ||
        !form.status.trim()
      ) {
        return false;
      }
      return true;
  }

  const onChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1); 


  const handleUpdate = async () => {
    if (!validateForm()) 
      return alert('Por favor, preencha todos os campos obrigatórios.');
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
      <TitleSubtitle title="Data da reserva: "/>
      <TitleSubtitle subtitle={normalizeDate(new Date(Array.isArray(params.data) ? params.data[0] : params.data)).toLocaleDateString()} />

      <Text style={styles.sectionTitle}>Dados do Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={form.nome}
        onChangeText={value => onChange('nome', value)}
        maxLength={50}
      />
       <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={value => onChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

     <TextInputMask
        type={'cel-phone'}
        options={{
          maskType: 'BRL',
          withDDD: true,
          dddMask: '(99) '
        }}
        style={styles.input}
        placeholder="Telefone"
        value={form.telefone}
        onChangeText={value => onChange('telefone', value)}
        keyboardType="phone-pad"
      />

      <TextInputMask
        type={'cpf'}
        style={styles.input}
        placeholder="Documento (CPF)"
        value={form.documento}
        onChangeText={value => onChange('documento', value)}
        keyboardType="numeric"
      />

    <Text style={styles.sectionTitle}>Informações da Reserva</Text>

      <TextInput
        style={styles.input}
        placeholder="Serviço"
        value={form.servico}
        onChangeText={value => onChange('servico', value)}
        maxLength={50}
      />

    <TextInput
      style={styles.input}
      placeholder="Observações"
      value={form.observacoes}
      onChangeText={value => onChange('observacoes', value)}
      maxLength={50}
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

    <CreateReservationButton
        title="Salvar alterações"
        onPress={handleUpdate}
        disabled={false}
    />

    <View style={{ height: 8 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 12,
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