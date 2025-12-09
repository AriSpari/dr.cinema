import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie, FavouriteMovie } from '../types';

const FAVOURITES_KEY = '@dr_cinema_favourites';

type FavouritesState = {
    favourites: FavouriteMovie[];
    loading: boolean;
    error: string | null;
};

const initialState: FavouritesState = {
    favourites: [],
    loading: false,
    error: null,
};

export const loadFavourites = createAsyncThunk(
    'favourites/load',
    async (_, { rejectWithValue }) => {
        try {
            const data = await AsyncStorage.getItem(FAVOURITES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveFavourites = createAsyncThunk(
    'favourites/save',
    async (favourites: FavouriteMovie[], { rejectWithValue }) => {
        try {
            await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
            return favourites;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const favouritesSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {
        addFavourite: (state, action: PayloadAction<Movie>) => {
            const exists = state.favourites.find(f => f.id === action.payload.id);
            if (!exists) {
                const newFavourite: FavouriteMovie = {
                    ...action.payload,
                    addedAt: new Date().toISOString(),
                    order: state.favourites.length,
                };
                state.favourites.push(newFavourite);
            }
        },
        removeFavourite: (state, action: PayloadAction<number>) => {
            state.favourites = state.favourites.filter(f => f.id !== action.payload);
            state.favourites.forEach((f, index) => {
                f.order = index;
            });
        },
        reorderFavourites: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
            const { fromIndex, toIndex } = action.payload;
            const [removed] = state.favourites.splice(fromIndex, 1);
            state.favourites.splice(toIndex, 0, removed);
            state.favourites.forEach((f, index) => {
                f.order = index;
            });
        },
        setFavourites: (state, action: PayloadAction<FavouriteMovie[]>) => {
            state.favourites = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFavourites.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadFavourites.fulfilled, (state, action) => {
                state.loading = false;
                state.favourites = action.payload;
            })
            .addCase(loadFavourites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(saveFavourites.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { addFavourite, removeFavourite, reorderFavourites, setFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
