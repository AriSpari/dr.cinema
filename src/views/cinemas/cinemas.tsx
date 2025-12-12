import React, { useEffect, useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '@/context/appcontext';
import { fetchCinemas } from '@/src/services/api';
import { colors } from '@/src/styles/colors';
import styles from './styles';

export function Cinemas() {
    const context = useContext(AppContext);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCinemas();
    }, []);

    const loadCinemas = async () => {
        try {
            setLoading(true);
            const data = await fetchCinemas();
            const cinemasArray = Array.isArray(data) ? data : (data as any)?.theaters || [];
            context?.setCinemas(cinemasArray);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    
    const sortedCinemas = [...(context?.cinemas || [])].sort((a, b) =>
        a.name.localeCompare(b.name, 'is')
    );

    const handleWebsitePress = (website: string | undefined) => {
        if (website) {
            const url = website.startsWith('http') ? website : `https://${website}`;
            Linking.openURL(url);
        }
    };

    if (loading) {
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
                <TouchableOpacity style={styles.retryButton} onPress={loadCinemas}>
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
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.cinemaCard}
                        onPress={() => router.push(`/cinema/${item.id}` as Href)}
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
                )}
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
