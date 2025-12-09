import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Cinema } from '../types';
import { fetchCinemas } from '../services/api';

type CinemasState = {
    cinemas: Cinema[];
    loading: boolean;
    error: string | null;
};

const initialState: CinemasState = {
    cinemas: [],
    loading: false,
    error: null,
};

export const fetchCinemasAsync = createAsyncThunk(
    'cinemas/fetchCinemas',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchCinemas();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const cinemasSlice = createSlice({
    name: 'cinemas',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCinemasAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCinemasAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.cinemas = action.payload;
            })
            .addCase(fetchCinemasAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default cinemasSlice.reducer;
