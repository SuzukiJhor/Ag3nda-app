import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import imageLogin from '../../assets/images/imageLogin.png';

export default function Step1() {
  const router = useRouter();  

  function handleNextStep() {
    router.push('/step2')
    return null
  }

  async function handleSkip() {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/');
    return null;
  }

  return (
    <View style={styles.container}>
        <Image
        source={imageLogin}
        style={styles.logo}
        />
      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.subtitle}>Aqui você pode agendar facilmente suas reservas.</Text>
      <TouchableOpacity style={styles.button} onPress={()=>{handleNextStep()}}>
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
       <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
    logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    justifyContent:'center',
    marginBottom: 40,
    },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: '#7209b7', padding: 16, borderRadius: 12, paddingHorizontal: 45 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  skipButton: { marginTop: 16 },
  skipText: { color: '#7209b7', fontSize: 16, textDecorationLine: 'underline' },
});
