import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from '../services/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <Stack 
          screenOptions={{ headerShown: false }}
          initialRouteName="(auth)/login" 
        >
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
          <Stack.Screen name="(auth)/forgot" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </UserProvider>
  );
}