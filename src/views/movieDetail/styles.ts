import { StyleSheet, Dimensions } from "react-native";
import { colors } from "@/src/styles/colors";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    poster: {
        width: '100%',
        height: 400,
        backgroundColor: colors.lightGray,
    },
    content: {
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.darkGray,
        marginRight: 12,
    },
    favButton: {
        padding: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    year: {
        fontSize: 14,
        color: colors.gray,
    },
    dot: {
        marginHorizontal: 8,
        color: colors.gray,
    },
    runtime: {
        fontSize: 14,
        color: colors.gray,
    },
    genres: {
        fontSize: 14,
        color: colors.darkerBlue,
        marginTop: 8,
    },
    ratingsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    ratingBox: {
        flex: 1,
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    ratingLabel: {
        fontSize: 11,
        color: colors.gray,
        marginBottom: 4,
    },
    ratingValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.darkGray,
    },
    trailerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.darkerBlue,
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
    },
    trailerButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    noTrailerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
    },
    noTrailerText: {
        color: colors.gray,
        fontSize: 14,
        marginLeft: 8,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 12,
    },
    plot: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 22,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailLabel: {
        width: 80,
        fontSize: 14,
        fontWeight: '500',
        color: colors.darkGray,
    },
    detailValue: {
        flex: 1,
        fontSize: 14,
        color: colors.gray,
    },
    showtimeBlock: {
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    cinemaName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 8,
    },
    scheduleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    scheduleButton: {
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.darkerBlue,
    },
    scheduleTime: {
        fontSize: 14,
        color: colors.darkerBlue,
        fontWeight: '500',
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
