import { Text, View, Image, TouchableOpacity } from "react-native";
<<<<<<< HEAD
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
=======
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
>>>>>>> 323d626b11bf73de23cf11e8aa054c6c8a37abcb
}
