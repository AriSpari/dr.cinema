import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    SectionList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { fetchMoviesAsync, setFilters, clearFilters, FilterState } from '@/src/store/moviesSlice';
import { MovieCard } from '@/src/components/MovieCard';
import { FilterModal } from '@/src/components/FilterModal';
import { LoadingView } from '@/src/components/LoadingView';
import { ErrorView } from '@/src/components/ErrorView';
import { groupMoviesByCinema, CinemaSection } from '@/src/utils/groupMoviesByCinema';
import { filterMovie, hasActiveFilters, emptyFilters } from '@/src/utils/movieFilters';
import { colors } from '@/src/styles/colors';

export default function HomeScreen() {
    const dispatch = useAppDispatch();
    const { movies, loading, error, filters } = useAppSelector(state => state.movies);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);

    useEffect(() => {
        dispatch(fetchMoviesAsync());
    }, [dispatch]);

    const groupedByCinema = useMemo(() => {
        return groupMoviesByCinema(movies);
    }, [movies]);

    const filteredSections = useMemo(() => {
        if (!hasActiveFilters(filters)) {
            return groupedByCinema;
        }

        return groupedByCinema
            .map(section => ({
                ...section,
                data: section.data.filter(movie => filterMovie(movie, filters, section.cinemaId)),
            }))
            .filter(section => section.data.length > 0);
    }, [groupedByCinema, filters]);

    const handleApplyFilters = () => {
        dispatch(setFilters(localFilters));
        setFilterModalVisible(false);
    };

    const handleResetFilters = () => {
        setLocalFilters(emptyFilters);
        dispatch(clearFilters());
        setFilterModalVisible(false);
    };

    const isFilterActive = hasActiveFilters(filters);

    if (loading && movies.length === 0) {
        return <LoadingView message="Loading movies..." />;
    }

    if (error) {
        return <ErrorView message={error} onRetry={() => dispatch(fetchMoviesAsync())} />;
    }

    return (
        <View style={styles.container}>
            <FilterButton
                isActive={isFilterActive}
                onPress={() => setFilterModalVisible(true)}
            />

            <SectionList
                sections={filteredSections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, section }) => (
                    <MovieCard movie={item} cinemaId={section.cinemaId} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <SectionHeader title={title} />
                )}
                stickySectionHeadersEnabled
                ListEmptyComponent={<EmptyState />}
            />

            <FilterModal
                visible={filterModalVisible}
                filters={localFilters}
                onFiltersChange={setLocalFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onClose={() => setFilterModalVisible(false)}
            />
        </View>
    );
}

type FilterButtonProps = {
    isActive: boolean;
    onPress: () => void;
};

function FilterButton({ isActive, onPress }: FilterButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.filterButton, isActive ? styles.filterButtonActive : null]}
            onPress={onPress}
        >
            <Ionicons
                name="filter"
                size={20}
                color={isActive ? colors.white : colors.darkerBlue}
            />
            <Text style={[styles.filterButtonText, isActive ? styles.filterButtonTextActive : null]}>
                Filter {isActive ? '(Active)' : ''}
            </Text>
        </TouchableOpacity>
    );
}

type SectionHeaderProps = {
    title: string;
};

function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

function EmptyState() {
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No movies found</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        margin: 16,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.darkerBlue,
    },
    filterButtonActive: {
        backgroundColor: colors.darkerBlue,
    },
    filterButtonText: {
        marginLeft: 8,
        color: colors.darkerBlue,
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: colors.white,
    },
    sectionHeader: {
        backgroundColor: colors.darkerBlue,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: colors.gray,
        fontSize: 16,
    },
});
