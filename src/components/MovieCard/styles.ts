import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/colors";

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 6,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    poster: {
        width: 80,
        height: 120,
        backgroundColor: colors.lightGray,
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.darkGray,
        marginBottom: 4,
    },
    year: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 4,
    },
    genres: {
        fontSize: 12,
        color: colors.gray,
    },
    certificate: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    certificateText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    showtimesContainer: {
        marginTop: 8,
    },
    showtimeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    showtimeText: {
        fontSize: 11,
        color: colors.darkerBlue,
        backgroundColor: colors.lighterBlue,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    moreText: {
        fontSize: 11,
        color: colors.gray,
        paddingVertical: 2,
    },
});
