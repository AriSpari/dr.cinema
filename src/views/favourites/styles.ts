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
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.darkGray,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerText: {
        fontSize: 14,
        color: colors.gray,
    },
    listContent: {
        padding: 16,
    },
    movieCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
    },
    movieContent: {
        flex: 1,
        flexDirection: 'row',
    },
    poster: {
        width: 60,
        height: 90,
        backgroundColor: colors.lightGray,
    },
    movieInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 4,
    },
    year: {
        fontSize: 13,
        color: colors.gray,
    },
    removeButton: {
        padding: 16,
    },
});
