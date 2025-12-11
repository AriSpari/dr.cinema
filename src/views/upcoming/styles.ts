import { StyleSheet, Dimensions } from "react-native";
import { colors } from "@/src/styles/colors";

const { width } = Dimensions.get('window');

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
    listContent: {
        padding: 16,
    },
    movieCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
    },
    poster: {
        width: 100,
        height: 150,
        backgroundColor: colors.lightGray,
    },
    movieInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 8,
    },
    releaseDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    releaseDate: {
        fontSize: 14,
        color: colors.gray,
        marginLeft: 4,
    },
    trailerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkerBlue,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    trailerButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    emptyText: {
        color: colors.gray,
        fontSize: 16,
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
});
