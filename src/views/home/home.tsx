import React, { useEffect, useContext, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppContext } from '@/context/appcontext';
import { fetchMovies } from '@/src/services/api';
import { MovieCard } from '@/src/components/MovieCard/MovieCard';
import { colors } from '@/src/styles/colors';
import styles from './styles';

export function Home() {
    const context = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        try {
            setLoading(true);
            const data = await fetchMovies();
            // API might return object with array or array directly
            const moviesArray = Array.isArray(data) ? data : (data as any)?.movies || [];
            context?.setMovies(moviesArray);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const groupedByCinema = () => {
        const cinemaMap: { [key: number]: { title: string; cinemaId: number; data: any[] } } = {};
        const movies = context?.movies || [];

        movies.forEach(movie => {
            movie.showtimes?.forEach(showtime => {
                const id = showtime.cinema.id;
                if (!cinemaMap[id]) {
                    cinemaMap[id] = {
                        title: showtime.cinema.name,
                        cinemaId: id,
                        data: [],
                    };
                }
                if (!cinemaMap[id].data.find(m => m.id === movie.id)) {
                    cinemaMap[id].data.push(movie);
                }
            });
        });

        return Object.values(cinemaMap).sort((a, b) => a.title.localeCompare(b.title, 'is'));
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.darkerBlue} />
                <Text style={styles.loadingText}>Loading movies...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadMovies}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const sections = groupedByCinema();

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, section }) => (
                    <MovieCard movie={item} cinemaId={section.cinemaId} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
                stickySectionHeadersEnabled
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No movies found</Text>
                    </View>
                }
            />
        </View>
    );
}
