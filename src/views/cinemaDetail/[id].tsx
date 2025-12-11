import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '@/context/appcontext';
import { MovieCard } from '@/src/components/MovieCard/MovieCard';
import { colors } from '@/src/styles/colors';
import styles from './styles';

export function CinemaDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const context = useContext(AppContext);

    const cinemaId = parseInt(id, 10);
    const cinema = context?.cinemas.find(c => c.id === cinemaId);

    const cinemaMovies = context?.movies.filter(movie =>
        movie.showtimes?.some(st => st.cinema.id === cinemaId)
    ) || [];

    if (!cinema) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.darkerBlue} />
            </View>
        );
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.cinemaName}>{cinema.name}</Text>

            {cinema.description && (
                <Text style={styles.description}>{cinema.description}</Text>
            )}

            <View style={styles.infoSection}>
                {(cinema.address || cinema.city) && (
                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color={colors.darkerBlue} />
                        <Text style={styles.infoText}>
                            {[cinema.address, cinema.city].filter(Boolean).join(', ')}
                        </Text>
                    </View>
                )}

                {cinema.phone && (
                    <TouchableOpacity
                        style={styles.infoRow}
                        onPress={() => Linking.openURL(`tel:${cinema.phone}`)}
                    >
                        <Ionicons name="call-outline" size={20} color={colors.darkerBlue} />
                        <Text style={[styles.infoText, styles.linkText]}>{cinema.phone}</Text>
                    </TouchableOpacity>
                )}

                {cinema.website && (
                    <TouchableOpacity
                        style={styles.infoRow}
                        onPress={() => {
                            const url = cinema.website?.startsWith('http') ? cinema.website : `https://${cinema.website}`;
                            Linking.openURL(url);
                        }}
                    >
                        <Ionicons name="globe-outline" size={20} color={colors.darkerBlue} />
                        <Text style={[styles.infoText, styles.linkText]} numberOfLines={1}>
                            {cinema.website}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.moviesHeader}>
                <Text style={styles.moviesTitle}>Now Showing</Text>
                <Text style={styles.moviesCount}>{cinemaMovies.length} movies</Text>
            </View>
        </View>
    );

    return (
        <>
            <Stack.Screen options={{ title: cinema.name }} />
            <View style={styles.container}>
                <FlatList
                    data={cinemaMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MovieCard movie={item} cinemaId={cinemaId} showShowtimes />
                    )}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No movies currently showing</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </>
    );
}
