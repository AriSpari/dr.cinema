import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Movie } from '@/src/types';
import { colors } from '@/src/styles/colors';

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
                {showShowtimes && relevantShowtimes && relevantShowtimes.length > 0 && (
                    <View style={styles.showtimesContainer}>
                        {relevantShowtimes.slice(0, 1).map((showtime, idx) => (
                            <View key={idx} style={styles.showtimeRow}>
                                {showtime.schedule.slice(0, 3).map((s, i) => (
                                    <Text key={i} style={styles.showtimeText}>{s.time}</Text>
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 6,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    poster: {
        width: 80,
        height: 120,
        backgroundColor: colors.lightGray,
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 4,
    },
    year: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 4,
    },
    genres: {
        fontSize: 12,
        color: colors.gray,
    },
    certificate: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    certificateText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    showtimesContainer: {
        marginTop: 8,
    },
    showtimeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    showtimeText: {
        fontSize: 11,
        color: colors.darkerBlue,
        backgroundColor: colors.lighterBlue,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    moreText: {
        fontSize: 11,
        color: colors.gray,
        paddingVertical: 2,
    },
});
