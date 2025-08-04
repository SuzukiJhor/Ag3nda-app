import { AuthProvider } from '@/context/AuthProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
     <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(customer)/newReservation" options={{
                headerTitle: '',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#fff',
                  },
                  headerTintColor: '#EB5E28',
                }}/>
              <Stack.Screen name="(customer)/updateReservation" options={{
                headerTitle: '',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#fff',
                  },
                  headerTintColor: '#EB5E28',
              }} />
              <Stack.Screen name="(onboarding)/step1" options={{
                headerTitle: '',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#fff',
                  },
                headerTintColor: '#EB5E28',
              }} />
              <Stack.Screen name="(onboarding)/step2" options={{
                headerTitle: '',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#fff',
                  },
                  headerTintColor: '#EB5E28',
              }} />
               <Stack.Screen name="(onboarding)/step3" options={{
                headerTitle: '',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#fff',
                  },
                headerTintColor: '#EB5E28',
              }} />
              <Stack.Screen name="+not-found" />
            </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
