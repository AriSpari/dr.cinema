import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/styles/colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.darkerBlue,
                tabBarInactiveTintColor: colors.gray,
                headerStyle: {
                    backgroundColor: colors.darkerBlue,
                },
                headerTintColor: '#fff',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cinemas"
                options={{
                    title: 'Cinemas',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="film" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="upcoming"
                options={{
                    title: 'Upcoming',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favourites"
                options={{
                    title: 'Favourites',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
