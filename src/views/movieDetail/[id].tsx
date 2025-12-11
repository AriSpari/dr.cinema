import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking, Modal, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from 'react-native-youtube-iframe';
import { AppContext } from '@/context/appcontext';
import { colors } from '@/src/styles/colors';
import styles from './styles';

const { width } = Dimensions.get('window');
const FAVOURITES_KEY = '@dr_cinema_favourites';

export function MovieDetail() {
    const { id, cinemaId } = useLocalSearchParams<{ id: string; cinemaId?: string }>();
    const context = useContext(AppContext);

    const [trailerVisible, setTrailerVisible] = useState(false);
    const [playing, setPlaying] = useState(false);

    const movieId = parseInt(id, 10);
    const selectedCinemaId = cinemaId ? parseInt(cinemaId, 10) : null;

    const movie = context?.movies.find(m => m.id === movieId);
    const isFavourite = context?.favourites.some(f => f.id === movieId);

    const omdb = movie?.omdb?.[0];
    const poster = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : movie?.poster;
    const title = omdb?.Title || movie?.title || '';

    const getTrailerKey = (): string | null => {
        if (!movie) return null;
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

    const trailerKey = getTrailerKey();

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') setPlaying(false);
    }, []);

    const handleFavouriteToggle = async () => {
        if (!movie || !context) return;

        let newFavs;
        if (isFavourite) {
            newFavs = context.favourites.filter(f => f.id !== movie.id);
        } else {
            newFavs = [...context.favourites, movie];
        }
        context.setFavourites(newFavs);
        await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(newFavs));
    };

    const relevantShowtimes = movie?.showtimes?.filter(st =>
        selectedCinemaId ? st.cinema.id === selectedCinemaId : true
    ) || [];

    if (!movie) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.darkerBlue} />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: title }} />
            <ScrollView style={styles.container}>
                <Image source={{ uri: poster }} style={styles.poster} resizeMode="cover" />

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={handleFavouriteToggle} style={styles.favButton}>
                            <Ionicons
                                name={isFavourite ? 'heart' : 'heart-outline'}
                                size={24}
                                color={isFavourite ? colors.red : colors.darkerBlue}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.year}>{omdb?.Year || movie.year}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.runtime}>{movie.durationMinutes} min</Text>
                    </View>

                    <Text style={styles.genres}>
                        {movie.genres?.map(g => g.NameEN).join(', ') || omdb?.Genre}
                    </Text>

                    <View style={styles.ratingsRow}>
                        {movie.ratings?.imdb && (
                            <View style={styles.ratingBox}>
                                <Text style={styles.ratingLabel}>IMDB</Text>
                                <Text style={styles.ratingValue}>{movie.ratings.imdb}/10</Text>
                            </View>
                        )}
                        {movie.ratings?.rotten_critics && movie.ratings.rotten_critics !== '0' && (
                            <View style={styles.ratingBox}>
                                <Text style={styles.ratingLabel}>Rotten</Text>
                                <Text style={styles.ratingValue}>{movie.ratings.rotten_critics}%</Text>
                            </View>
                        )}
                    </View>

                    {trailerKey ? (
                        <TouchableOpacity
                            style={styles.trailerButton}
                            onPress={() => { setTrailerVisible(true); setPlaying(true); }}
                        >
                            <Ionicons name="play-circle" size={24} color={colors.white} />
                            <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.noTrailerBox}>
                            <Ionicons name="videocam-off-outline" size={24} color={colors.gray} />
                            <Text style={styles.noTrailerText}>No trailer available</Text>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Plot</Text>
                        <Text style={styles.plot}>{omdb?.Plot || movie.plot}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Details</Text>
                        {omdb?.Director && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Director</Text>
                                <Text style={styles.detailValue}>{omdb.Director}</Text>
                            </View>
                        )}
                        {omdb?.Actors && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Actors</Text>
                                <Text style={styles.detailValue}>{omdb.Actors}</Text>
                            </View>
                        )}
                    </View>

                    {relevantShowtimes.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Showtimes</Text>
                            {relevantShowtimes.map((showtime, idx) => (
                                <View key={idx} style={styles.showtimeBlock}>
                                    <Text style={styles.cinemaName}>{showtime.cinema.name}</Text>
                                    <View style={styles.scheduleContainer}>
                                        {showtime.schedule.map((s, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                style={styles.scheduleButton}
                                                onPress={() => Linking.openURL(s.purchase_url)}
                                            >
                                                <Text style={styles.scheduleTime}>{s.time}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <Modal
                    visible={trailerVisible}
                    animationType="fade"
                    transparent
                    onRequestClose={() => { setTrailerVisible(false); setPlaying(false); }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{title}</Text>
                                <TouchableOpacity onPress={() => { setTrailerVisible(false); setPlaying(false); }}>
                                    <Ionicons name="close" size={28} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                            {trailerKey && (
                                <YoutubePlayer
                                    height={width * 0.5625}
                                    width={width - 32}
                                    play={playing}
                                    videoId={trailerKey}
                                    onChangeState={onStateChange}
                                />
                            )}
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </>
    );
}
