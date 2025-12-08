import { StyleSheet } from "react-native";
<<<<<<< HEAD

import { lighterBlue, gray } from "@/src/styles/colors";

=======
import { lighterBlue, gray } from "../../styles/colors";
>>>>>>> 323d626b11bf73de23cf11e8aa054c6c8a37abcb

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: lighterBlue,
        alignItems: "center",
        justifyContent: "space-evenly"
  },
    image: {
        width: 400,
        height: 300,
        resizeMode: "contain",
    },
    button:{
        backgroundColor: gray,
        padding: 10,
        borderRadius: 5,
    }
});