import { Stack } from 'expo-router';
import { AppProvider } from '@/context/appcontext';

export default function RootLayout() {
    return (
        <AppProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="movie/[id]"
                    options={{
                        headerShown: true,
                        title: 'Movie Details',
                        headerBackTitle: 'Back',
                    }}
                />
                <Stack.Screen
                    name="cinema/[id]"
                    options={{
                        headerShown: true,
                        title: 'Cinema Details',
                        headerBackTitle: 'Back',
                    }}
                />
            </Stack>
        </AppProvider>
    );
}
