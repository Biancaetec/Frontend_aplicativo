import { Stack } from 'expo-router';
import { AuthProvider } from '../hooks/Auth/useAuth';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false, // remove header do Stack em todas as telas por padrão
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="cadastrar"
          options={{
            headerShown: true,
            headerTitle: 'Cadastre',
          }}
        />
      </Stack>
    </AuthProvider>
  );
}