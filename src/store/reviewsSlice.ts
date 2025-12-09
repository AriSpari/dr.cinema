import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review } from '../types';

const REVIEWS_KEY = '@dr_cinema_reviews';

type ReviewsState = {
    reviews: Review[];
    loading: boolean;
    error: string | null;
};

const initialState: ReviewsState = {
    reviews: [],
    loading: false,
    error: null,
};

export const loadReviews = createAsyncThunk(
    'reviews/load',
    async (_, { rejectWithValue }) => {
        try {
            const data = await AsyncStorage.getItem(REVIEWS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveReviews = createAsyncThunk(
    'reviews/save',
    async (reviews: Review[], { rejectWithValue }) => {
        try {
            await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
            return reviews;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        addReview: (state, action: PayloadAction<Omit<Review, 'id' | 'createdAt'>>) => {
            const newReview: Review = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };
            state.reviews.push(newReview);
        },
        removeReview: (state, action: PayloadAction<string>) => {
            state.reviews = state.reviews.filter(r => r.id !== action.payload);
        },
        updateReview: (state, action: PayloadAction<{ id: string; rating?: number; text?: string }>) => {
            const review = state.reviews.find(r => r.id === action.payload.id);
            if (review) {
                if (action.payload.rating !== undefined) review.rating = action.payload.rating;
                if (action.payload.text !== undefined) review.text = action.payload.text;
            }
        },
        setReviews: (state, action: PayloadAction<Review[]>) => {
            state.reviews = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(loadReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addReview, removeReview, updateReview, setReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
