import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Movie } from '@/src/types';
import styles from './styles';

type MovieCardProps = {
    movie: Movie;
    cinemaId?: number;
    showShowtimes?: boolean;
};

export function MovieCard({ movie, cinemaId, showShowtimes }: MovieCardProps) {
    const router = useRouter();
    const omdb = movie.omdb?.[0];
    const poster = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : movie.poster;
    const title = omdb?.Title || movie.title;
    const year = omdb?.Year || movie.year;
    const genres = movie.genres?.map(g => g.NameEN).join(', ') || omdb?.Genre || '';
    const imdbRating = movie.ratings?.imdb;
    const rottenRating = movie.ratings?.rotten_critics;

    const handlePress = () => {
        let path = `/movie/${movie.id}`;
        if (cinemaId) {
            path += `?cinemaId=${cinemaId}`;
        }
        router.push(path as Href);
    };

    const relevantShowtimes = cinemaId
        ? movie.showtimes?.filter(s => s.cinema.id === cinemaId)
        : movie.showtimes;

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
            <Image
                source={{ uri: poster }}
                style={styles.poster}
                resizeMode="cover"
            />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Text style={styles.year}>{year}</Text>
                {genres ? <Text style={styles.genres} numberOfLines={1}>{genres}</Text> : null}

                <View style={styles.ratingsRow}>
                    {imdbRating && (
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingLabel}>IMDB</Text>
                            <Text style={styles.ratingValue}>{imdbRating}</Text>
                        </View>
                    )}
                    {rottenRating && rottenRating !== '0' && (
                        <View style={styles.rottenBadge}>
                            <Text style={styles.ratingLabel}>RT</Text>
                            <Text style={styles.ratingValue}>{rottenRating}%</Text>
                        </View>
                    )}
                </View>

                {showShowtimes && relevantShowtimes && relevantShowtimes.length > 0 && (
                    <View style={styles.showtimesContainer}>
                        {relevantShowtimes.slice(0, 1).map((showtime, idx) => (
                            <View key={`${movie.id}-showtime-${idx}`} style={styles.showtimeRow}>
                                {showtime.schedule.slice(0, 3).map((s, i) => (
                                    <Text key={`${movie.id}-showtime-${idx}-time-${i}`} style={styles.showtimeText}>
                                        {s.time}
                                    </Text>
                                ))}
                                {showtime.schedule.length > 3 && (
                                    <Text style={styles.moreText}>+{showtime.schedule.length - 3} more</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </View>
            {movie.certificate?.color && (
                <View style={[styles.certificate, { backgroundColor: movie.certificate.color }]}>
                    <Text style={styles.certificateText}>{movie.certificate.number}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}