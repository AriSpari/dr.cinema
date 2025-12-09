import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
    Modal,
    Dimensions,
    TextInput,
    Share,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { fetchMoviesAsync } from '@/src/store/moviesSlice';
import { addFavourite, removeFavourite, saveFavourites } from '@/src/store/favouritesSlice';
import { addReview, saveReviews, loadReviews } from '@/src/store/reviewsSlice';
import { colors } from '@/src/styles/colors';
import { Movie, Review } from '@/src/types';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen() {
    const { id, cinemaId } = useLocalSearchParams<{ id: string; cinemaId?: string }>();
    const dispatch = useAppDispatch();
    const { movies, loading } = useAppSelector(state => state.movies);
    const { favourites } = useAppSelector(state => state.favourites);
    const { reviews } = useAppSelector(state => state.reviews);

    const [trailerVisible, setTrailerVisible] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(0);

    const movieId = parseInt(id, 10);
    const selectedCinemaId = cinemaId ? parseInt(cinemaId, 10) : null;

    useEffect(() => {
        if (movies.length === 0) {
            dispatch(fetchMoviesAsync());
        }
        dispatch(loadReviews());
    }, [dispatch, movies.length]);

    const movie = useMemo(() => {
        return movies.find(m => m.id === movieId);
    }, [movies, movieId]);

    const isFavourite = useMemo(() => {
        return favourites.some(f => f.id === movieId);
    }, [favourites, movieId]);

    const movieReviews = useMemo(() => {
        return reviews.filter(r => r.movieId === movieId);
    }, [reviews, movieId]);

    const averageUserRating = useMemo(() => {
        if (movieReviews.length === 0) return null;
        const sum = movieReviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / movieReviews.length).toFixed(1);
    }, [movieReviews]);

    const omdb = movie?.omdb?.[0];
    const poster = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : movie?.poster;
    const title = omdb?.Title || movie?.title || '';

    const getTrailerKey = (): string | null => {
        if (!movie) return null;
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

    const trailerKey = getTrailerKey();

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);

    const handleFavouriteToggle = () => {
        if (!movie) return;
        if (isFavourite) {
            dispatch(removeFavourite(movie.id));
        } else {
            dispatch(addFavourite(movie));
        }
        dispatch(saveFavourites(favourites));
    };

    const handleShare = async () => {
        if (!movie) return;
        try {
            await Share.share({
                message: `Check out "${title}" - ${omdb?.Plot || movie.plot}\n\nIMDB: ${movie.ratings?.imdb || 'N/A'}/10`,
                title: title,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleSubmitReview = () => {
        if (newReviewRating === 0) return;
        dispatch(addReview({
            movieId,
            rating: newReviewRating,
            text: newReviewText,
        }));
        dispatch(saveReviews(reviews));
        setNewReviewText('');
        setNewReviewRating(0);
        setReviewModalVisible(false);
    };

    const handlePurchaseTicket = (url: string) => {
        Linking.openURL(url);
    };

    const relevantShowtimes = useMemo(() => {
        if (!movie) return [];
        if (selectedCinemaId) {
            return movie.showtimes?.filter(st => st.cinema.id === selectedCinemaId) || [];
        }
        return movie.showtimes || [];
    }, [movie, selectedCinemaId]);

    if (loading && !movie) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.darkerBlue} />
            </View>
        );
    }

    if (!movie) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Movie not found</Text>
            </View>
        );
    }

    const renderStars = (rating: number, onPress?: (r: number) => void) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => onPress?.(i)}
                    disabled={!onPress}
                >
                    <Ionicons
                        name={i <= rating ? 'star' : 'star-outline'}
                        size={onPress ? 32 : 16}
                        color={colors.yellow}
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.starsContainer}>{stars}</View>;
    };

    return (
        <>
            <Stack.Screen options={{ title: title }} />
            <ScrollView style={styles.container}>
                <Image source={{ uri: poster }} style={styles.poster} resizeMode="cover" />

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                                <Ionicons name="share-outline" size={24} color={colors.darkerBlue} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleFavouriteToggle} style={styles.actionButton}>
                                <Ionicons
                                    name={isFavourite ? 'heart' : 'heart-outline'}
                                    size={24}
                                    color={isFavourite ? colors.red : colors.darkerBlue}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.year}>{omdb?.Year || movie.year}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.runtime}>{movie.durationMinutes} min</Text>
                        {movie.certificate && (
                            <>
                                <Text style={styles.dot}>•</Text>
                                <View style={[styles.certificate, { backgroundColor: movie.certificate.color }]}>
                                    <Text style={styles.certificateText}>{movie.certificate.number}</Text>
                                </View>
                            </>
                        )}
                    </View>

                    <Text style={styles.genres}>
                        {movie.genres?.map(g => g.NameEN).join(', ') || omdb?.Genre}
                    </Text>

                    {/* Ratings Section */}
                    <View style={styles.ratingsSection}>
                        <Text style={styles.sectionTitle}>Ratings</Text>
                        <View style={styles.ratingsRow}>
                            {movie.ratings?.imdb && movie.ratings.imdb !== 'N/A' && (
                                <View style={styles.ratingBox}>
                                    <Text style={styles.ratingLabel}>IMDB</Text>
                                    <Text style={styles.ratingValue}>{movie.ratings.imdb}/10</Text>
                                </View>
                            )}
                            {movie.ratings?.rotten_critics && movie.ratings.rotten_critics !== '0' && (
                                <View style={styles.ratingBox}>
                                    <Text style={styles.ratingLabel}>Rotten Tomatoes</Text>
                                    <Text style={styles.ratingValue}>{movie.ratings.rotten_critics}%</Text>
                                </View>
                            )}
                            {averageUserRating && (
                                <View style={styles.ratingBox}>
                                    <Text style={styles.ratingLabel}>User Rating</Text>
                                    <Text style={styles.ratingValue}>{averageUserRating}/5</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Trailer Button */}
                    {trailerKey ? (
                        <TouchableOpacity
                            style={styles.trailerButton}
                            onPress={() => {
                                setTrailerVisible(true);
                                setPlaying(true);
                            }}
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

                    {/* Plot */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Plot</Text>
                        <Text style={styles.plot}>{omdb?.Plot || movie.plot}</Text>
                    </View>

                    {/* Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Details</Text>

                        {(omdb?.Director || movie.directors_abridged?.length > 0) && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Director</Text>
                                <Text style={styles.detailValue}>
                                    {omdb?.Director || movie.directors_abridged?.map(d => d.name).join(', ')}
                                </Text>
                            </View>
                        )}

                        {omdb?.Writer && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Writers</Text>
                                <Text style={styles.detailValue}>{omdb.Writer}</Text>
                            </View>
                        )}

                        {(omdb?.Actors || movie.actors_abridged?.length > 0) && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Actors</Text>
                                <Text style={styles.detailValue}>
                                    {omdb?.Actors || movie.actors_abridged?.map(a => a.name).join(', ')}
                                </Text>
                            </View>
                        )}

                        {omdb?.Country && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Country</Text>
                                <Text style={styles.detailValue}>{omdb.Country}</Text>
                            </View>
                        )}

                        {omdb?.Language && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Language</Text>
                                <Text style={styles.detailValue}>{omdb.Language}</Text>
                            </View>
                        )}
                    </View>

                    {/* Showtimes */}
                    {relevantShowtimes.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Showtimes & Tickets</Text>
                            {relevantShowtimes.map((showtime, idx) => (
                                <View key={idx} style={styles.showtimeBlock}>
                                    <Text style={styles.cinemaName}>{showtime.cinema.name}</Text>
                                    <View style={styles.scheduleContainer}>
                                        {showtime.schedule.map((s, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                style={styles.scheduleButton}
                                                onPress={() => handlePurchaseTicket(s.purchase_url)}
                                            >
                                                <Text style={styles.scheduleTime}>{s.time}</Text>
                                                <Ionicons name="ticket-outline" size={14} color={colors.darkerBlue} />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Reviews Section */}
                    <View style={styles.section}>
                        <View style={styles.reviewsHeader}>
                            <Text style={styles.sectionTitle}>User Reviews</Text>
                            <TouchableOpacity
                                style={styles.addReviewButton}
                                onPress={() => setReviewModalVisible(true)}
                            >
                                <Ionicons name="add" size={20} color={colors.white} />
                                <Text style={styles.addReviewText}>Add Review</Text>
                            </TouchableOpacity>
                        </View>

                        {movieReviews.length === 0 ? (
                            <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
                        ) : (
                            movieReviews.map(review => (
                                <View key={review.id} style={styles.reviewCard}>
                                    {renderStars(review.rating)}
                                    {review.text && <Text style={styles.reviewText}>{review.text}</Text>}
                                    <Text style={styles.reviewDate}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>
                </View>

                {/* Trailer Modal */}
                <Modal
                    visible={trailerVisible}
                    animationType="fade"
                    transparent
                    onRequestClose={() => {
                        setTrailerVisible(false);
                        setPlaying(false);
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{title}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setTrailerVisible(false);
                                        setPlaying(false);
                                    }}
                                >
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

                {/* Review Modal */}
                <Modal
                    visible={reviewModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setReviewModalVisible(false)}
                >
                    <View style={styles.reviewModalOverlay}>
                        <View style={styles.reviewModalContent}>
                            <View style={styles.reviewModalHeader}>
                                <Text style={styles.reviewModalTitle}>Write a Review</Text>
                                <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={colors.darkGray} />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.ratingPrompt}>Your Rating</Text>
                            {renderStars(newReviewRating, setNewReviewRating)}

                            <Text style={styles.reviewPrompt}>Your Review (optional)</Text>
                            <TextInput
                                style={styles.reviewInput}
                                value={newReviewText}
                                onChangeText={setNewReviewText}
                                placeholder="What did you think of this movie?"
                                multiline
                                numberOfLines={4}
                            />

                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    newReviewRating === 0 && styles.submitButtonDisabled,
                                ]}
                                onPress={handleSubmitReview}
                                disabled={newReviewRating === 0}
                            >
                                <Text style={styles.submitButtonText}>Submit Review</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
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
    poster: {
        width: '100%',
        height: 400,
        backgroundColor: colors.lightGray,
    },
    content: {
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.darkGray,
        marginRight: 12,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    year: {
        fontSize: 14,
        color: colors.gray,
    },
    dot: {
        marginHorizontal: 8,
        color: colors.gray,
    },
    runtime: {
        fontSize: 14,
        color: colors.gray,
    },
    certificate: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    certificateText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    genres: {
        fontSize: 14,
        color: colors.darkerBlue,
        marginTop: 8,
    },
    ratingsSection: {
        marginTop: 20,
    },
    ratingsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    ratingBox: {
        flex: 1,
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    ratingLabel: {
        fontSize: 11,
        color: colors.gray,
        marginBottom: 4,
    },
    ratingValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkGray,
    },
    trailerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.darkerBlue,
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
    },
    trailerButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    noTrailerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
    },
    noTrailerText: {
        color: colors.gray,
        fontSize: 14,
        marginLeft: 8,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 12,
    },
    plot: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 22,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailLabel: {
        width: 80,
        fontSize: 14,
        fontWeight: '500',
        color: colors.darkGray,
    },
    detailValue: {
        flex: 1,
        fontSize: 14,
        color: colors.gray,
    },
    showtimeBlock: {
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    cinemaName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 8,
    },
    scheduleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.darkerBlue,
    },
    scheduleTime: {
        fontSize: 14,
        color: colors.darkerBlue,
        fontWeight: '500',
        marginRight: 6,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkerBlue,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    addReviewText: {
        color: colors.white,
        fontSize: 14,
        marginLeft: 4,
    },
    noReviewsText: {
        color: colors.gray,
        fontStyle: 'italic',
    },
    reviewCard: {
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    reviewText: {
        fontSize: 14,
        color: colors.darkGray,
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: colors.gray,
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
    reviewModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    reviewModalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    reviewModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    reviewModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.darkGray,
    },
    ratingPrompt: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.darkGray,
        marginBottom: 8,
    },
    reviewPrompt: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.darkGray,
        marginTop: 16,
        marginBottom: 8,
    },
    reviewInput: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: colors.darkerBlue,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: colors.gray,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
