import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    // 1. On enveloppe toute l'application avec le Provider pour gérer les zones sûres (encoches)
    <SafeAreaProvider>
      
      {/* 2. Le Stack gère la pile d'écrans (on empile les pages les unes sur les autres) */}
      <Stack screenOptions={{ headerShown: false }}>
        
        {/* On définit que l'écran principal est notre dossier (tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Plus tard, ta page de détails sera ici aussi */}
        
      </Stack>
      
    </SafeAreaProvider>
  );
}