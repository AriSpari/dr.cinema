import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '@/context/appcontext';
import { colors } from '@/src/styles/colors';
import { Movie } from '@/src/types';
import styles from './styles';

const FAVOURITES_KEY = '@dr_cinema_favourites';

export function Favourites() {
    const context = useContext(AppContext);
    const router = useRouter();

    useEffect(() => {
        loadFavourites();
    }, []);

    const loadFavourites = async () => {
        try {
            const data = await AsyncStorage.getItem(FAVOURITES_KEY);
            if (data) {
                context?.setFavourites(JSON.parse(data));
            }
        } catch (error) {
            console.error('Error loading favourites:', error);
        }
    };

    const saveFavourites = async (favs: Movie[]) => {
        try {
            await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favs));
        } catch (error) {
            console.error('Error saving favourites:', error);
        }
    };

    const handleRemove = (movieId: number, movieTitle: string) => {
        Alert.alert(
            'Remove from Favourites',
            `Remove "${movieTitle}" from favourites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        const newFavs = context?.favourites.filter(f => f.id !== movieId) || [];
                        context?.setFavourites(newFavs);
                        saveFavourites(newFavs);
                    },
                },
            ]
        );
    };

    if (context?.favourites.length === 0) {
        return (
            <View style={styles.centered}>
                <Ionicons name="heart-outline" size={64} color={colors.gray} />
                <Text style={styles.emptyTitle}>No Favourites Yet</Text>
                <Text style={styles.emptyText}>Movies you add to favourites will appear here</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {context?.favourites.length} {context?.favourites.length === 1 ? 'movie' : 'movies'}
                </Text>
            </View>
            <FlatList
                data={context?.favourites || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const omdb = item.omdb?.[0];
                    const poster = omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : item.poster;
                    const title = omdb?.Title || item.title;
                    const year = omdb?.Year || item.year;

                    return (
                        <View style={styles.movieCard}>
                            <TouchableOpacity
                                style={styles.movieContent}
                                onPress={() => router.push(`/movie/${item.id}` as Href)}
                            >
                                <Image source={{ uri: poster }} style={styles.poster} resizeMode="cover" />
                                <View style={styles.movieInfo}>
                                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                                    <Text style={styles.year}>{year}</Text>
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
                }}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}
