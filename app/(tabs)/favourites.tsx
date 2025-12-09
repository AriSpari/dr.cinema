import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/src/store';
import {
    loadFavourites,
    removeFavourite,
    reorderFavourites,
    saveFavourites,
} from '@/src/store/favouritesSlice';
import { colors } from '@/src/styles/colors';
import { FavouriteMovie } from '@/src/types';

export default function FavouritesScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { favourites, loading } = useAppSelector(state => state.favourites);

    useEffect(() => {
        dispatch(loadFavourites());
    }, [dispatch]);

    useEffect(() => {
        if (favourites.length > 0) {
            dispatch(saveFavourites(favourites));
        }
    }, [favourites, dispatch]);

    const handleMoviePress = (movie: FavouriteMovie) => {
        router.push(`/movie/${movie.id}` as Href);
    };

    const handleRemove = (movieId: number, movieTitle: string) => {
        Alert.alert(
            'Remove from Favourites',
            `Are you sure you want to remove "${movieTitle}" from your favourites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => dispatch(removeFavourite(movieId)),
                },
            ]
        );
    };

    const handleMoveUp = (index: number) => {
        if (index > 0) {
            dispatch(reorderFavourites({ fromIndex: index, toIndex: index - 1 }));
        }
    };

    const handleMoveDown = (index: number) => {
        if (index < favourites.length - 1) {
            dispatch(reorderFavourites({ fromIndex: index, toIndex: index + 1 }));
        }
    };

    const renderFavouriteItem = ({ item, index }: { item: FavouriteMovie; index: number }) => {
        const omdb = item.omdb?.[0];
        const poster = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : item.poster;
        const title = omdb?.Title || item.title;
        const year = omdb?.Year || item.year;
        const genres = item.genres?.map(g => g.NameEN).join(', ') || omdb?.Genre || '';

        return (
            <View style={styles.movieCard}>
                <View style={styles.reorderButtons}>
                    <TouchableOpacity
                        onPress={() => handleMoveUp(index)}
                        disabled={index === 0}
                        style={[styles.reorderButton, index === 0 && styles.reorderButtonDisabled]}
                    >
                        <Ionicons
                            name="chevron-up"
                            size={20}
                            color={index === 0 ? colors.lightGray : colors.darkerBlue}
                        />
                    </TouchableOpacity>
                    <Text style={styles.orderNumber}>{index + 1}</Text>
                    <TouchableOpacity
                        onPress={() => handleMoveDown(index)}
                        disabled={index === favourites.length - 1}
                        style={[
                            styles.reorderButton,
                            index === favourites.length - 1 && styles.reorderButtonDisabled,
                        ]}
                    >
                        <Ionicons
                            name="chevron-down"
                            size={20}
                            color={index === favourites.length - 1 ? colors.lightGray : colors.darkerBlue}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.movieContent}
                    onPress={() => handleMoviePress(item)}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{ uri: poster }}
                        style={styles.poster}
                        resizeMode="cover"
                    />
                    <View style={styles.movieInfo}>
                        <Text style={styles.title} numberOfLines={2}>{title}</Text>
                        <Text style={styles.year}>{year}</Text>
                        {genres ? <Text style={styles.genres} numberOfLines={1}>{genres}</Text> : null}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(item.id, title)}
                >
                    <Ionicons name="trash-outline" size={22} color={colors.red} />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>Loading favourites...</Text>
            </View>
        );
    }

    if (favourites.length === 0) {
        return (
            <View style={styles.centered}>
                <Ionicons name="heart-outline" size={64} color={colors.gray} />
                <Text style={styles.emptyTitle}>No Favourites Yet</Text>
                <Text style={styles.emptyText}>
                    Movies you add to favourites will appear here
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {favourites.length} {favourites.length === 1 ? 'movie' : 'movies'} in your list
                </Text>
            </View>
            <FlatList
                data={favourites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderFavouriteItem}
                contentContainerStyle={styles.listContent}
            />
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
        color: colors.gray,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.darkGray,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerText: {
        fontSize: 14,
        color: colors.gray,
    },
    listContent: {
        padding: 16,
    },
    movieCard: {
        flexDirection: 'row',
        alignItems: 'center',
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
    reorderButtons: {
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    reorderButton: {
        padding: 4,
    },
    reorderButtonDisabled: {
        opacity: 0.3,
    },
    orderNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.darkerBlue,
    },
    movieContent: {
        flex: 1,
        flexDirection: 'row',
    },
    poster: {
        width: 60,
        height: 90,
        backgroundColor: colors.lightGray,
    },
    movieInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 4,
    },
    year: {
        fontSize: 13,
        color: colors.gray,
        marginBottom: 2,
    },
    genres: {
        fontSize: 12,
        color: colors.gray,
    },
    removeButton: {
        padding: 16,
    },
});
