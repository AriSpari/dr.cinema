import { Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles";

export function Main() {
  const router = useRouter();
  return (
    <View
      style={styles.container}>
        <Text>Main Screen</Text>
      </View>
  )

}
