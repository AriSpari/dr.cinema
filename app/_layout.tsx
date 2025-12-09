import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/src/store';

export default function RootLayout() {
    return (
        <Provider store={store}>
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
        </Provider>
    );
}
