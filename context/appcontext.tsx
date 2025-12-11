import React, { createContext, useState } from "react";
import { Movie, Cinema, Review } from "@/src/types";

export type AppContextType = {
    movies: Movie[];
    setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
    upcomingMovies: Movie[];
    setUpcomingMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
    cinemas: Cinema[];
    setCinemas: React.Dispatch<React.SetStateAction<Cinema[]>>;
    favourites: Movie[];
    setFavourites: React.Dispatch<React.SetStateAction<Movie[]>>;
    reviews: Review[];
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [favourites, setFavourites] = useState<Movie[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    return (
        <AppContext.Provider value={{
            movies, setMovies,
            upcomingMovies, setUpcomingMovies,
            cinemas, setCinemas,
            favourites, setFavourites,
            reviews, setReviews,
        }}>
            {children}
        </AppContext.Provider>
    );
};
