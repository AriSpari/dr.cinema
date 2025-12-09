import { Text, View, Image, TouchableOpacity, FlatList} from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles";
import { fetchMovies } from "@/src/services/get_movies";
import { useEffect, useState } from "react";
import { Card } from "@/src/components/card/card";
import { Movie } from "@/src/models/movie";



const moviesData = require("@/moviedata.json");

export function Main() {
  const router = useRouter();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetchMovies()
  //     .then(data => {
  //       setMovies(data);
  //       setLoading(false);
  //     })
  //     .catch(err => {
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []);
console.log("moviesData type:", Array.isArray(moviesData), moviesData.length);

  return (
    <View
      style={styles.container}>
        
          <Text>Main Screen</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/cinemas")}>
            <Text style={styles.buttonText}>Go to Cinemas</Text>
          </TouchableOpacity>
          {
          moviesData.map(movie => {
            const omdb = movie.omdb?.[0];
            if (!omdb) {
              return null;
            }

            return (
              <Card 
                key={movie.id}
                title={omdb.title}
                subtitle={`${omdb.Year} · ${omdb.Runtime}`}
                description={omdb.Plot}
                imageUrl={omdb.Poster}
                color={movie.certificate?.color}
              />
            )
          })
        }
    </View>
  )

}
