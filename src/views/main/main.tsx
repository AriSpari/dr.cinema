import { Text, View, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import { useRouter } from "expo-router";

export function Main() {
  const router = useRouter();
  return (   
     <View style={styles.container}>
        {/* <Image style={styles.image} source={require("../../../assets/images/contactor_logo.png")} /> */}
        <Text>The best app around.</Text>
        <TouchableOpacity
          
          style = {styles.button}
        >
          <Text>Get Started</Text>
        </TouchableOpacity>
      </View>
    );
}
