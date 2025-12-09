import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../types';
import { fetchMovies, fetchUpcomingMovies, fetchCinemas } from '../services/api';

export type FilterState = {
    title: string;
    imdbRating: number | null;
    rottenRating: number | null;
    showtimeFrom: string;
    showtimeTo: string;
    actors: string;
    directors: string;
    pgRating: string;
};

type MoviesState = {
    movies: Movie[];
    upcomingMovies: Movie[];
    loading: boolean;
    upcomingLoading: boolean;
    error: string | null;
    filters: FilterState;
};

const initialFilters: FilterState = {
    title: '',
    imdbRating: null,
    rottenRating: null,
    showtimeFrom: '',
    showtimeTo: '',
    actors: '',
    directors: '',
    pgRating: '',
};

const initialState: MoviesState = {
    movies: [],
    upcomingMovies: [],
    loading: false,
    upcomingLoading: false,
    error: null,
    filters: initialFilters,
};

export const fetchMoviesAsync = createAsyncThunk(
    'movies/fetchMovies',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchMovies();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUpcomingMoviesAsync = createAsyncThunk(
    'movies/fetchUpcomingMovies',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchUpcomingMovies();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialFilters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMoviesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMoviesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchMoviesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUpcomingMoviesAsync.pending, (state) => {
                state.upcomingLoading = true;
            })
            .addCase(fetchUpcomingMoviesAsync.fulfilled, (state, action) => {
                state.upcomingLoading = false;
                state.upcomingMovies = action.payload;
            })
            .addCase(fetchUpcomingMoviesAsync.rejected, (state, action) => {
                state.upcomingLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters } = moviesSlice.actions;
export default moviesSlice.reducer;
