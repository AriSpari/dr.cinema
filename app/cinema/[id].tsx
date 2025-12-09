import React, { useEffect, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Linking,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { fetchCinemasAsync } from '@/src/store/cinemasSlice';
import { fetchMoviesAsync } from '@/src/store/moviesSlice';
import { MovieCard } from '@/src/components/MovieCard';
import { colors } from '@/src/styles/colors';
import { Movie } from '@/src/types';

export default function CinemaDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { cinemas, loading: cinemasLoading } = useAppSelector(state => state.cinemas);
    const { movies, loading: moviesLoading } = useAppSelector(state => state.movies);

    const cinemaId = parseInt(id, 10);

    useEffect(() => {
        if (cinemas.length === 0) {
            dispatch(fetchCinemasAsync());
        }
        if (movies.length === 0) {
            dispatch(fetchMoviesAsync());
        }
    }, [dispatch, cinemas.length, movies.length]);

    const cinema = useMemo(() => {
        return cinemas.find(c => c.id === cinemaId);
    }, [cinemas, cinemaId]);

    const cinemaMovies = useMemo(() => {
        return movies.filter(movie =>
            movie.showtimes?.some(st => st.cinema.id === cinemaId)
        );
    }, [movies, cinemaId]);

    const handlePhonePress = () => {
        if (cinema?.phone) {
            Linking.openURL(`tel:${cinema.phone}`);
        }
    };

    const handleWebsitePress = () => {
        if (cinema?.website) {
            const url = cinema.website.startsWith('http') ? cinema.website : `https://${cinema.website}`;
            Linking.openURL(url);
        }
    };

    if (cinemasLoading || moviesLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.darkerBlue} />
            </View>
        );
    }

    if (!cinema) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Cinema not found</Text>
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
                    <TouchableOpacity style={styles.infoRow} onPress={handlePhonePress}>
                        <Ionicons name="call-outline" size={20} color={colors.darkerBlue} />
                        <Text style={[styles.infoText, styles.linkText]}>{cinema.phone}</Text>
                    </TouchableOpacity>
                )}

                {cinema.website && (
                    <TouchableOpacity style={styles.infoRow} onPress={handleWebsitePress}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: colors.red,
        fontSize: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    header: {
        backgroundColor: colors.white,
        padding: 16,
        marginBottom: 8,
    },
    cinemaName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.darkGray,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 20,
        marginBottom: 16,
    },
    infoSection: {
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        paddingTop: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: colors.darkGray,
        marginLeft: 12,
        flex: 1,
    },
    linkText: {
        color: colors.darkerBlue,
    },
    moviesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    moviesTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.darkGray,
    },
    moviesCount: {
        fontSize: 14,
        color: colors.gray,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.gray,
        fontSize: 16,
    },
});
