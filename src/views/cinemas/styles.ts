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
