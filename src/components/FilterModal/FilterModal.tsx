import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterState } from '@/src/store/moviesSlice';
import { colors } from '@/src/styles/colors';

type FilterModalProps = {
    visible: boolean;
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    onApply: () => void;
    onReset: () => void;
    onClose: () => void;
};

export function FilterModal({
    visible,
    filters,
    onFiltersChange,
    onApply,
    onReset,
    onClose,
}: FilterModalProps) {
    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filter Movies</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.darkGray} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.filterForm}>
                        <FilterInput
                            label="Title"
                            value={filters.title}
                            onChangeText={(text) => updateFilter('title', text)}
                            placeholder="Search by title..."
                        />

                        <FilterInput
                            label="Min IMDB Rating (0-10)"
                            value={filters.imdbRating?.toString() || ''}
                            onChangeText={(text) => updateFilter('imdbRating', text ? parseFloat(text) : null)}
                            placeholder="e.g., 7"
                            keyboardType="numeric"
                        />

                        <FilterInput
                            label="Min Rotten Tomatoes (0-100)"
                            value={filters.rottenRating?.toString() || ''}
                            onChangeText={(text) => updateFilter('rottenRating', text ? parseFloat(text) : null)}
                            placeholder="e.g., 70"
                            keyboardType="numeric"
                        />

                        <FilterInput
                            label="Showtime From (HH:MM)"
                            value={filters.showtimeFrom}
                            onChangeText={(text) => updateFilter('showtimeFrom', text)}
                            placeholder="e.g., 20:00"
                        />

                        <FilterInput
                            label="Showtime To (HH:MM)"
                            value={filters.showtimeTo}
                            onChangeText={(text) => updateFilter('showtimeTo', text)}
                            placeholder="e.g., 22:00"
                        />

                        <FilterInput
                            label="Actors"
                            value={filters.actors}
                            onChangeText={(text) => updateFilter('actors', text)}
                            placeholder="Search by actor name..."
                        />

                        <FilterInput
                            label="Directors"
                            value={filters.directors}
                            onChangeText={(text) => updateFilter('directors', text)}
                            placeholder="Search by director name..."
                        />

                        <FilterInput
                            label="PG Rating"
                            value={filters.pgRating}
                            onChangeText={(text) => updateFilter('pgRating', text)}
                            placeholder="e.g., L, 6, 9, 12, 16"
                        />
                    </ScrollView>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

type FilterInputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'numeric';
};

function FilterInput({ label, value, onChangeText, placeholder, keyboardType = 'default' }: FilterInputProps) {
    return (
        <>
            <Text style={styles.filterLabel}>{label}</Text>
            <TextInput
                style={styles.filterInput}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkGray,
    },
    filterForm: {
        padding: 16,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.darkGray,
        marginTop: 12,
        marginBottom: 4,
    },
    filterInput: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    resetButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray,
        alignItems: 'center',
    },
    resetButtonText: {
        color: colors.gray,
        fontWeight: '600',
    },
    applyButton: {
        flex: 2,
        padding: 14,
        borderRadius: 8,
        backgroundColor: colors.darkerBlue,
        alignItems: 'center',
    },
    applyButtonText: {
        color: colors.white,
        fontWeight: '600',
    },
});
