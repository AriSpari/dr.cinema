import { Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles";

export function Cinemas() {
    const router = useRouter();
    return (
        <View
            style={styles.container}>
            <Text>Cinemas Screen</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/")}>
                <Text style={styles.buttonText}>Go to Main</Text>
            </TouchableOpacity>
        </View>
    )
}