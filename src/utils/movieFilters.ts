import { Movie } from '../types';
import { FilterState } from '../store/moviesSlice';

export function filterMovie(movie: Movie, filters: FilterState, cinemaId?: number): boolean {
    const omdb = movie.omdb?.[0];
    const title = omdb?.Title || movie.title;

    if (filters.title && !title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
    }

    if (filters.imdbRating) {
        const imdb = parseFloat(movie.ratings?.imdb || '0');
        if (imdb < filters.imdbRating) return false;
    }

    if (filters.rottenRating) {
        const rotten = parseFloat(movie.ratings?.rotten_critics || '0');
        if (rotten < filters.rottenRating) return false;
    }

    if (filters.actors) {
        const actors = movie.actors_abridged?.map(a => a.name.toLowerCase()).join(' ') || '';
        if (!actors.includes(filters.actors.toLowerCase())) return false;
    }

    if (filters.directors) {
        const directors = movie.directors_abridged?.map(d => d.name.toLowerCase()).join(' ') || '';
        if (!directors.includes(filters.directors.toLowerCase())) return false;
    }

    if (filters.pgRating && movie.certificate?.number !== filters.pgRating) {
        return false;
    }

    if (filters.showtimeFrom || filters.showtimeTo) {
        const hasValidShowtime = movie.showtimes?.some(st =>
            (cinemaId === undefined || st.cinema.id === cinemaId) &&
            st.schedule.some(s => {
                const timeMatch = s.time.match(/(\d{2}:\d{2})/);
                if (!timeMatch) return false;
                const time = timeMatch[1];
                if (filters.showtimeFrom && time < filters.showtimeFrom) return false;
                if (filters.showtimeTo && time > filters.showtimeTo) return false;
                return true;
            })
        );
        if (!hasValidShowtime) return false;
    }

    return true;
}

export function hasActiveFilters(filters: FilterState): boolean {
    return !!(
        filters.title ||
        filters.imdbRating ||
        filters.rottenRating ||
        filters.showtimeFrom ||
        filters.showtimeTo ||
        filters.actors ||
        filters.directors ||
        filters.pgRating
    );
}

export const emptyFilters: FilterState = {
    title: '',
    imdbRating: null,
    rottenRating: null,
    showtimeFrom: '',
    showtimeTo: '',
    actors: '',
    directors: '',
    pgRating: '',
};
