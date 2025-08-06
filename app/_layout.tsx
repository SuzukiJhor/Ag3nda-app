import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { ReservationProvider } from '@/context/ReservationProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!loading) {
      if (!user && !inAuthGroup) {
        router.replace('/login');
        return;
      }
    }
  }, [user, loading, segments, router]);

  if (loading) return null;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(customer)/newReservation" options={headerOptions} />
      <Stack.Screen name="(customer)/updateReservation" options={headerOptions} />
      <Stack.Screen name="(onboarding)/step1" options={headerOptions} />
      <Stack.Screen name="(onboarding)/step2" options={headerOptions} />
      <Stack.Screen name="(onboarding)/step3" options={headerOptions} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const headerOptions = {
  headerTitle: '',
  headerShown: true,
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTintColor: '#EB5E28',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <ReservationProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <ProtectedLayout />
          <StatusBar style="auto" />
        </ThemeProvider>
      </ReservationProvider>
    </AuthProvider>
  );
}
