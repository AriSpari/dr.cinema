import React, { useEffect, useContext, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '@/context/appcontext';
import { fetchUpcomingMovies } from '@/src/services/api';
import { colors } from '@/src/styles/colors';
import { Movie } from '@/src/types';
import YoutubePlayer from 'react-native-youtube-iframe';
import styles from './styles';

const { width } = Dimensions.get('window');

export function Upcoming() {
    const context = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        loadUpcoming();
    }, []);

    const loadUpcoming = async () => {
        try {
            setLoading(true);
            const data = await fetchUpcomingMovies();
            const upcomingArray = Array.isArray(data) ? data : (data as any)?.upcoming || [];
            context?.setUpcomingMovies(upcomingArray);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getTrailerKey = (movie: Movie): string | null => {
        if (movie.trailers && movie.trailers.length > 0) {
            const trailer = movie.trailers[0];
            if (trailer.results && trailer.results.length > 0) {
                const yt = trailer.results.find(t => t.site === 'YouTube');
                if (yt) return yt.key;
            }
            if (trailer.url) {
                const match = trailer.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
                if (match) return match[1];
            }
        }
        return null;
    };

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') setPlaying(false);
    }, []);

    if (loading) {
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
                <TouchableOpacity style={styles.retryButton} onPress={loadUpcoming}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={context?.upcomingMovies || []}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => {
                    const omdb = item.omdb?.[0];
                    const poster = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : item.poster;
                    const title = omdb?.Title || item.title;
                    const releaseDate = omdb?.Released || item.year || 'TBA';
                    const hasTrailer = getTrailerKey(item) !== null;

                    return (
                        <View style={styles.movieCard}>
                            <Image source={{ uri: poster }} style={styles.poster} resizeMode="cover" />
                            <View style={styles.movieInfo}>
                                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                                <View style={styles.releaseDateRow}>
                                    <Ionicons name="calendar-outline" size={14} color={colors.gray} />
                                    <Text style={styles.releaseDate}>{releaseDate}</Text>
                                </View>
                                {hasTrailer && (
                                    <TouchableOpacity
                                        style={styles.trailerButton}
                                        onPress={() => { setTrailerMovie(item); setPlaying(true); }}
                                    >
                                        <Ionicons name="play-circle" size={20} color={colors.white} />
                                        <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                }}
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
                onRequestClose={() => { setTrailerMovie(null); setPlaying(false); }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle} numberOfLines={1}>
                                {trailerMovie?.omdb?.[0]?.Title || trailerMovie?.title}
                            </Text>
                            <TouchableOpacity onPress={() => { setTrailerMovie(null); setPlaying(false); }}>
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
