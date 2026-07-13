import { Stack } from 'expo-router';
import { useColors } from '@/hooks/useColors';

export default function PapersLayout() {
  const colors = useColors();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.card }, headerTintColor: colors.primary }}>
      <Stack.Screen name="[grade]" options={{ title: 'ECZ Past Papers' }} />
    </Stack>
  );
}
