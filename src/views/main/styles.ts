import { StyleSheet } from "react-native";

import { lighterBlue, gray } from "@/src/styles/colors";


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