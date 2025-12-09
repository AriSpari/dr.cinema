import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/src/styles/colors';

type LoadingViewProps = {
    message?: string;
};

export function LoadingView({ message = 'Loading...' }: LoadingViewProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.darkerBlue} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginTop: 10,
        color: colors.gray,
    },
});
