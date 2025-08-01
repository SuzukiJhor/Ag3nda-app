import CreateReservationButton from '@/components/button/ButtonCreateNewReservation';
import { TitleSubtitle } from '@/components/button/TitleSubtitle';
import Loading from '@/components/Loading';
import { db } from '@/firebase';
import { useHandleGoBack } from '@/hooks/useHandleGoBack';
import { maskCpf } from '@/utils/maskCPF';
import { maskPhone } from '@/utils/maskPhone';
import { normalizeDate } from '@/utils/normalizeDate';
import { getStatusColor } from '@/utils/statusColors';
import { useLocalSearchParams } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { FormData } from '../types/form';

export default function NewReservationScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const handleGoBack = useHandleGoBack({ fallbackRoute: "/(tabs)" });
  const [loading, setLoading] = React.useState(false);
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
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

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


  const addReservation = async () => {
    setLoading(true);
    if (!validateForm()) 
      return console.error('Por favor, preencha todos os campos obrigatórios.');

    const newReservation = {
      id: Date.now().toString(),
      data,
      ...form,
    };
  
    try {
      await addDoc(collection(db, 'reservas'), newReservation);
      return handleGoBack();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
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
    <ScrollView contentContainerStyle={styles.container}>
      <TitleSubtitle title="Data da reserva: "/>
      <TitleSubtitle title= {normalizeDate(new Date(data)).toLocaleDateString()}/>
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
          title="Salvar Reserva"
          onPress={addReservation}
          disabled={!validateForm()}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
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
