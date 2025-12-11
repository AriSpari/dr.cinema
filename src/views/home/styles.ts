import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/colors";

export default StyleSheet.create({
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
    emptyText: {
        color: colors.gray,
        fontSize: 16,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkerBlue,
        paddingHorizontal: 16,
        paddingVertical: 10,
        margin: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    filterButtonText: {
        color: colors.white,
        fontWeight: '600',
        marginLeft: 8,
    },
    filterBadge: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.red,
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
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
    filterScroll: {
        padding: 16,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 6,
        marginTop: 12,
    },
    filterInput: {
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    clearButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray,
        alignItems: 'center',
    },
    clearButtonText: {
        color: colors.gray,
        fontWeight: '600',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.darkerBlue,
        alignItems: 'center',
    },
    applyButtonText: {
        color: colors.white,
        fontWeight: '600',
    },
});
