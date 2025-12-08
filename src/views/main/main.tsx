import { Text, View, Image, TouchableOpacity, FlatList} from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles";
import { fetchMovies } from "@/src/services/get_movies";
import { useEffect, useState } from "react";


export function Main() {
  const router = useRouter();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies()
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <View
      style={styles.container}>
        <Text>Main Screen</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/cinemas")}>
          <Text style={styles.buttonText}>Go to Details</Text>
        </TouchableOpacity>
    </View>
  )

}
