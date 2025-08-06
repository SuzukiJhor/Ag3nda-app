import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export function useOnboarding() {
  const [onboarding, setOnboarding] = React.useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = React.useState(true);

  React.useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        setOnboarding(hasSeen === 'true');
      } catch (err) {
        console.error('Erro ao verificar onboarding:', err);
        setOnboarding(false);
      } finally {
        setCheckingOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  return { onboarding, checkingOnboarding };
}