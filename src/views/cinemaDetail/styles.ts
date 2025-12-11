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
    },
    listContent: {
        paddingBottom: 20,
    },
    header: {
        backgroundColor: colors.white,
        padding: 16,
        marginBottom: 8,
    },
    cinemaName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.darkGray,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 20,
        marginBottom: 16,
    },
    infoSection: {
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        paddingTop: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: colors.darkGray,
        marginLeft: 12,
        flex: 1,
    },
    linkText: {
        color: colors.darkerBlue,
    },
    moviesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    moviesTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.darkGray,
    },
    moviesCount: {
        fontSize: 14,
        color: colors.gray,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.gray,
        fontSize: 16,
    },
});
