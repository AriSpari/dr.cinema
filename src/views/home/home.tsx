import React, { useEffect, useContext, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '@/context/appcontext';
import { fetchMovies } from '@/src/services/api';
import { MovieCard } from '@/src/components/MovieCard/MovieCard';
import { colors } from '@/src/styles/colors';
import { Movie } from '@/src/types';
import styles from './styles';

type Filters = {
    title: string;
    minImdb: string;
    minRotten: string;
    timeFrom: string;
    timeTo: string;
    actor: string;
    director: string;
    pgRating: string;
};

const emptyFilters: Filters = {
    title: '',
    minImdb: '',
    minRotten: '',
    timeFrom: '',
    timeTo: '',
    actor: '',
    director: '',
    pgRating: '',
};

export function Home() {
    const context = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState<Filters>(emptyFilters);
    const [tempFilters, setTempFilters] = useState<Filters>(emptyFilters);

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        try {
            setLoading(true);
            const data = await fetchMovies();
            const moviesArray = Array.isArray(data) ? data : (data as any)?.movies || [];
            context?.setMovies(moviesArray);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (movies: Movie[]): Movie[] => {
        return movies.filter(movie => {
            const omdb = movie.omdb?.[0];
            const title = omdb?.Title || movie.title || '';

            // Title filter
            if (filters.title && !title.toLowerCase().includes(filters.title.toLowerCase())) {
                return false;
            }

            // IMDB rating filter
            if (filters.minImdb) {
                const imdb = parseFloat(movie.ratings?.imdb || '0');
                if (imdb < parseFloat(filters.minImdb)) return false;
            }

            // Rotten Tomatoes filter
            if (filters.minRotten) {
                const rotten = parseFloat(movie.ratings?.rotten_critics || '0');
                if (rotten < parseFloat(filters.minRotten)) return false;
            }

            // Actor filter
            if (filters.actor) {
                const actors = movie.actors_abridged?.map(a => a.name.toLowerCase()) || [];
                const omdbActors = omdb?.Actors?.toLowerCase() || '';
                if (!actors.some(a => a.includes(filters.actor.toLowerCase())) &&
                    !omdbActors.includes(filters.actor.toLowerCase())) {
                    return false;
                }
            }

            // Director filter
            if (filters.director) {
                const directors = movie.directors_abridged?.map(d => d.name.toLowerCase()) || [];
                const omdbDirector = omdb?.Director?.toLowerCase() || '';
                if (!directors.some(d => d.includes(filters.director.toLowerCase())) &&
                    !omdbDirector.includes(filters.director.toLowerCase())) {
                    return false;
                }
            }

            // PG rating filter
            if (filters.pgRating) {
                const cert = movie.certificate?.number || movie.certificateIS || '';
                if (cert !== filters.pgRating) return false;
            }

            // Showtime range filter
            if (filters.timeFrom || filters.timeTo) {
                const hasValidShowtime = movie.showtimes?.some(st =>
                    st.schedule.some(s => {
                        const time = s.time;
                        if (filters.timeFrom && time < filters.timeFrom) return false;
                        if (filters.timeTo && time > filters.timeTo) return false;
                        return true;
                    })
                );
                if (!hasValidShowtime) return false;
            }

            return true;
        });
    };

    const groupedByCinema = () => {
        const cinemaMap: { [key: number]: { title: string; cinemaId: number; data: Movie[] } } = {};
        const movies = applyFilters(context?.movies || []);

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

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    const openFilter = () => {
        setTempFilters(filters);
        setShowFilter(true);
    };

    const applyAndClose = () => {
        setFilters(tempFilters);
        setShowFilter(false);
    };

    const clearFilters = () => {
        setTempFilters(emptyFilters);
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
            <TouchableOpacity style={styles.filterButton} onPress={openFilter}>
                <Ionicons name="filter" size={20} color={colors.white} />
                <Text style={styles.filterButtonText}>Filter</Text>
                {hasActiveFilters && <View style={styles.filterBadge} />}
            </TouchableOpacity>

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

            <Modal visible={showFilter} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filter Movies</Text>
                            <TouchableOpacity onPress={() => setShowFilter(false)}>
                                <Ionicons name="close" size={24} color={colors.darkGray} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.filterScroll}>
                            <Text style={styles.filterLabel}>Title</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={tempFilters.title}
                                onChangeText={(v) => setTempFilters({ ...tempFilters, title: v })}
                                placeholder="Search title..."
                            />

                            <Text style={styles.filterLabel}>Min IMDB Rating (0-10)</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={tempFilters.minImdb}
                                onChangeText={(v) => setTempFilters({ ...tempFilters, minImdb: v })}
                                placeholder="e.g. 7"
                                keyboardType="numeric"
                            />

                            <Text style={styles.filterLabel}>Min Rotten Tomatoes (%)</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={tempFilters.minRotten}
                                onChangeText={(v) => setTempFilters({ ...tempFilters, minRotten: v })}
                                placeholder="e.g. 70"
                                keyboardType="numeric"
                            />

                            <Text style={styles.filterLabel}>Showtime From</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={tempFilters.timeFrom}
                                onChangeText={(v) => setTempFilters({ ...tempFilters, timeFrom: v })}
                                placeholder="e.g. 18:00"
                            />

                            <Text style={styles.filterLabel}>Showtime To</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={tempFilters.timeTo}
                                onChangeText={(v) => setTempFilters({ ...tempFilters, timeTo: v })}
                                placeholder="e.g. 22:00"
                            />

                            <Text style={styles.filterLabel}>Actor</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={tempFilters.actor}
                                onChangeText={(v) => setTempFilters({ ...tempFilters, actor: v })}
                                placeholder="Search actor..."
                            />

                            <Text style={styles.filterLabel}>Director</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={tempFilters.director}
                                onChangeText={(v) => setTempFilters({ ...tempFilters, director: v })}
                                placeholder="Search director..."
                            />

                            <Text style={styles.filterLabel}>PG Rating</Text>
                            <TextInput
                                style={styles.filterInput}
                                value={tempFilters.pgRating}
                                onChangeText={(v) => setTempFilters({ ...tempFilters, pgRating: v })}
                                placeholder="e.g. 12, 16, 18"
                            />
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                                <Text style={styles.clearButtonText}>Clear</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyButton} onPress={applyAndClose}>
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
