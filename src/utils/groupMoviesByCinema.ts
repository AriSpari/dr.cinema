import { Movie } from '../types';

export type CinemaSection = {
    title: string;
    cinemaId: number;
    data: Movie[];
};

export function groupMoviesByCinema(movies: Movie[]): CinemaSection[] {
    const cinemaMap = new Map<number, { name: string; movies: Movie[] }>();

    movies.forEach(movie => {
        movie.showtimes?.forEach(showtime => {
            const cinemaId = showtime.cinema.id;
            const cinemaName = showtime.cinema.name;

            if (!cinemaMap.has(cinemaId)) {
                cinemaMap.set(cinemaId, { name: cinemaName, movies: [] });
            }
            const cinema = cinemaMap.get(cinemaId)!;
            if (!cinema.movies.find(m => m.id === movie.id)) {
                cinema.movies.push(movie);
            }
        });
    });

    const sections: CinemaSection[] = [];
    cinemaMap.forEach((value, key) => {
        sections.push({
            title: value.name,
            cinemaId: key,
            data: value.movies,
        });
    });

    return sections.sort((a, b) => a.title.localeCompare(b.title));
}
