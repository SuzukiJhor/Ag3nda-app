import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import Loading from '@/components/Loading';
import { useHandleGoBack } from '@/hooks/useHandleGoBack';
import { getReservaRefById } from '@/services/getReservationRefById';
import { formatDateLocal } from '@/utils/formatDateLocal';
import { maskCpf } from '@/utils/maskCPF';
import { maskPhone } from '@/utils/maskPhone';
import { getStatusColor } from '@/utils/statusColors';
import { useLocalSearchParams } from 'expo-router';
import { updateDoc } from 'firebase/firestore';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import Modal from 'react-native-modal';
import { FormData, statusOptions } from '../types/form';

export default function UpdateClientScreen() {
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
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

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  function validateForm() {
    return (
      form.nome.trim() &&
      form.email.trim() &&
      form.telefone.trim() &&
      form.documento.trim() &&
      form.status.trim()
    );
  }

  const onChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const handleUpdate = async () => {
    setLoading(true);
    if (!validateForm()) {
      showModal('Preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const idInterno = (rawId || "").trim();

    try {
      const reservaRef = await getReservaRefById(idInterno);
      if (!reservaRef) {
        showModal('Reserva não encontrada com esse ID interno.');
        return;
      }
      await updateDoc(reservaRef, { ...form });
      handleGoBack();
    } catch (err) {
      console.error("Erro ao atualizar reserva:", err);
      showModal('Erro ao atualizar reserva.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
      <ScrollView contentContainerStyle={styles.container}>
        <TitleSubtitle title="Data da reserva: " />
        <TitleSubtitle title={formatDateLocal(params.data as string)} />
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
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={form.telefone}
          onChangeText={value => onChange('telefone', maskPhone(value))}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Documento (CPF)"
          value={form.documento}
          onChangeText={value => onChange('documento', maskCpf(value))}
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
              <View style={styles.toggleGroup}>
                {statusOptions.map(option => {
                  const isSelected = form.status === option;
                  const selectedColor = getStatusColor(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => onChange('status', option)}
                      style={[
                        styles.toggleButton,
                        isSelected && {
                          backgroundColor: selectedColor,
                          borderColor: selectedColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          isSelected && {
                            color: ['pendente', 'expirado'].includes(option) ? '#333' : '#fff',
                          },
                        ]}
                      >
                        {capitalize(option)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

        <CreateReservationButton
          title="Salvar alterações"
          onPress={handleUpdate}
          disabled={!validateForm()}
        />

        {/* Modal */}
        <Modal isVisible={modalVisible}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={{ height: 8 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 12,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#EB5E28',
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
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#EB5E28',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
    toggleGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f1f1',
  },

    toggleButtonSelected: {
      backgroundColor: '#EB5E28',
      borderColor: '#EB5E28',
    },

    toggleButtonText: {
      fontSize: 14,
      color: '#444',
      fontWeight: '500',
    },

    toggleButtonTextSelected: {
      color: '#fff',
    }

});
