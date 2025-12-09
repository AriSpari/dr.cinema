import React, { useEffect, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { fetchCinemasAsync } from '@/src/store/cinemasSlice';
import { colors } from '@/src/styles/colors';
import { Cinema } from '@/src/types';

export default function CinemasScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { cinemas, loading, error } = useAppSelector(state => state.cinemas);

    useEffect(() => {
        dispatch(fetchCinemasAsync());
    }, [dispatch]);

    const sortedCinemas = useMemo(() => {
        return [...cinemas].sort((a, b) => a.name.localeCompare(b.name, 'is'));
    }, [cinemas]);

    const handleCinemaPress = (cinema: Cinema) => {
        router.push(`/cinema/${cinema.id}` as Href);
    };

    const handleWebsitePress = (website: string | undefined) => {
        if (website) {
            const url = website.startsWith('http') ? website : `https://${website}`;
            Linking.openURL(url);
        }
    };

    const renderCinemaItem = ({ item }: { item: Cinema }) => (
        <TouchableOpacity
            style={styles.cinemaCard}
            onPress={() => handleCinemaPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cinemaInfo}>
                <Text style={styles.cinemaName}>{item.name}</Text>
                {item.website && (
                    <TouchableOpacity
                        style={styles.websiteButton}
                        onPress={() => handleWebsitePress(item.website)}
                    >
                        <Ionicons name="globe-outline" size={16} color={colors.darkerBlue} />
                        <Text style={styles.websiteText} numberOfLines={1}>
                            {item.website}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.gray} />
        </TouchableOpacity>
    );

    if (loading && cinemas.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.darkerBlue} />
                <Text style={styles.loadingText}>Loading cinemas...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(fetchCinemasAsync())}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedCinemas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCinemaItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No cinemas available</Text>
                    </View>
                }
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
    cinemaCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cinemaInfo: {
        flex: 1,
    },
    cinemaName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 4,
    },
    websiteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    websiteText: {
        fontSize: 14,
        color: colors.darkerBlue,
        marginLeft: 4,
        flex: 1,
    },
    emptyText: {
        color: colors.gray,
        fontSize: 16,
    },
});
