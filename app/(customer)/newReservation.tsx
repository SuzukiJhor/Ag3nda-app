import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import Loading from '@/components/Loading';
import { db } from '@/firebase';
import { useHandleGoBack } from '@/hooks/useHandleGoBack';
import { formatDateLocal } from '@/utils/formatDateLocal';
import { maskCpf } from '@/utils/maskCPF';
import { maskPhone } from '@/utils/maskPhone';
import { getStatusColor } from '@/utils/statusColors';
import { useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import { FormData } from '../types/form';

export default function NewReservationScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const handleGoBack = useHandleGoBack({ fallbackRoute: '/(tabs)' });
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const auth = getAuth();
  const [form, setForm] = React.useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    servico: '',
    status: '',
    observacoes: '',
  });

  const onChange = React.useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  function validateForm() {
    return (
      form.nome.trim() &&
      form.email.trim() &&
      form.telefone.trim() &&
      form.documento.trim() &&
      form.status.trim()
    );
  }

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const addReservation = async () => {
    if (!validateForm()) {
      showModal('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Usuário não autenticado.');
      setLoading(false);
      return;
    }

    const userId = currentUser.uid;

    const newReservation = {
      id: Date.now().toString(),
      userId,
      data,
      ...form,
    };

    try {
      await addDoc(collection(db, 'reservas'), newReservation);
      handleGoBack();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      showModal('Erro ao salvar a reserva. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const statusOptions: FormData['status'][] = [
    'pendente',
    'confirmado',
    'cancelado',
    'expirado',
  ];

  if (loading) return <Loading />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TitleSubtitle title="Data da reserva: " />
        <TitleSubtitle title={formatDateLocal(data)} />
        <Text style={styles.sectionTitle}>Dados do Cliente</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={form.nome}
          onChangeText={(value) => onChange('nome', value)}
          maxLength={50}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => onChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={form.telefone}
          onChangeText={(value) => onChange('telefone', maskPhone(value))}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Documento (CPF)</Text>
        <TextInput
          style={styles.input}
          placeholder="Documento (CPF)"
          value={form.documento}
          onChangeText={(value) => onChange('documento', maskCpf(value))}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Informações da Reserva</Text>

        <Text style={styles.label}>Serviço</Text>
        <TextInput
          style={styles.input}
          placeholder="Serviço"
          value={form.servico}
          onChangeText={(value) => onChange('servico', value)}
          maxLength={50}
        />

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={styles.input}
          placeholder="Observações"
          value={form.observacoes}
          onChangeText={(value) => onChange('observacoes', value)}
          maxLength={50}
        />

        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.toggleGroup}>
          {statusOptions.map((option) => {
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
                      color: ['pendente', 'expirado'].includes(option)
                        ? '#333'
                        : '#fff',
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
          title="Salvar Reserva"
          onPress={addReservation}
          disabled={!validateForm()}
        />

        {/* MODAL DE ALERTA */}
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={modalStyles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    color: '#252422',
    marginBottom: 4,
    marginLeft: 2,
    fontWeight: '500',
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
  toggleButtonText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
});

const modalStyles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#EB5E28',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
