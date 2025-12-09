import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { fetchUpcomingMoviesAsync } from '@/src/store/moviesSlice';
import { colors } from '@/src/styles/colors';
import { Movie } from '@/src/types';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');

export default function UpcomingScreen() {
    const dispatch = useAppDispatch();
    const { upcomingMovies, upcomingLoading, error } = useAppSelector(state => state.movies);
    const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        dispatch(fetchUpcomingMoviesAsync());
    }, [dispatch]);

    const sortedMovies = useMemo(() => {
        return [...upcomingMovies].sort((a, b) => {
            const dateA = a.omdb?.[0]?.Released || a.year || '';
            const dateB = b.omdb?.[0]?.Released || b.year || '';
            return dateA.localeCompare(dateB);
        });
    }, [upcomingMovies]);

    const getTrailerKey = (movie: Movie): string | null => {
        if (movie.trailers && movie.trailers.length > 0) {
            const trailer = movie.trailers[0];
            if (trailer.results && trailer.results.length > 0) {
                const youtubeTrailer = trailer.results.find(t => t.site === 'YouTube');
                if (youtubeTrailer) return youtubeTrailer.key;
            }
            if (trailer.url) {
                const match = trailer.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
                if (match) return match[1];
            }
        }
        return null;
    };

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);

    const renderMovieItem = ({ item }: { item: Movie }) => {
        const omdb = item.omdb?.[0];
        const poster = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : item.poster;
        const title = omdb?.Title || item.title;
        const releaseDate = omdb?.Released || item.year || 'TBA';
        const hasTrailer = getTrailerKey(item) !== null;

        return (
            <View style={styles.movieCard}>
                <Image
                    source={{ uri: poster }}
                    style={styles.poster}
                    resizeMode="cover"
                />
                <View style={styles.movieInfo}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    <View style={styles.releaseDateContainer}>
                        <Ionicons name="calendar-outline" size={14} color={colors.gray} />
                        <Text style={styles.releaseDate}>{releaseDate}</Text>
                    </View>
                    {hasTrailer && (
                        <TouchableOpacity
                            style={styles.trailerButton}
                            onPress={() => {
                                setTrailerMovie(item);
                                setPlaying(true);
                            }}
                        >
                            <Ionicons name="play-circle" size={20} color={colors.white} />
                            <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    if (upcomingLoading && upcomingMovies.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.darkerBlue} />
                <Text style={styles.loadingText}>Loading upcoming movies...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(fetchUpcomingMoviesAsync())}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedMovies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMovieItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No upcoming movies</Text>
                    </View>
                }
            />

            <Modal
                visible={trailerMovie !== null}
                animationType="fade"
                transparent
                onRequestClose={() => {
                    setTrailerMovie(null);
                    setPlaying(false);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle} numberOfLines={1}>
                                {trailerMovie?.omdb?.[0]?.Title || trailerMovie?.title}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setTrailerMovie(null);
                                    setPlaying(false);
                                }}
                            >
                                <Ionicons name="close" size={28} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        {trailerMovie && getTrailerKey(trailerMovie) && (
                            <YoutubePlayer
                                height={width * 0.5625}
                                width={width - 32}
                                play={playing}
                                videoId={getTrailerKey(trailerMovie)!}
                                onChangeState={onStateChange}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
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
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: colors.gray,
    },
    errorText: {
        color: colors.red,
        textAlign: 'center',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: colors.darkerBlue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: colors.white,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    movieCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    poster: {
        width: 100,
        height: 150,
        backgroundColor: colors.lightGray,
    },
    movieInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 8,
    },
    releaseDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    releaseDate: {
        fontSize: 14,
        color: colors.gray,
        marginLeft: 4,
    },
    trailerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkerBlue,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    trailerButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    emptyText: {
        color: colors.gray,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width - 32,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        marginRight: 16,
    },
});
