import { useAuth } from '@/context/AuthProvider';
import { auth } from "@/firebase";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import imageLogin from '../../assets/images/imageLogin.png';

export default function Login() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      router.replace('/');
      return null;
    } catch (error: any) {
      console.error('Erro de login:', error.message);
      Alert.alert('Erro', 'Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
      if (user && !authLoading) {
        router.push('/');
        return;
      }
  }, [authLoading, user]);

 return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
       <View style={styles.logoContainer}>
          <Image
            source={imageLogin}
            style={styles.logo}
          />
       </View>
      <View style={styles.form}>
      
      <Text style={styles.title}>{'Login'}</Text>

       <View style={styles.header}>
       
        </View>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o e-mail do usuário"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
       <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Digite sua senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#555"
              style={{ paddingHorizontal: 8, marginBottom: 15 }}
            />
          </TouchableOpacity>
        </View>


        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  form: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#252422',
  },
  input: {
    // borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#7209b7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
  marginBottom: 24,
},
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    justifyContent:'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EB5E28', 
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 0,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 8,
    // backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
});
