import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import moviesReducer from './moviesSlice';
import cinemasReducer from './cinemasSlice';
import favouritesReducer from './favouritesSlice';
import reviewsReducer from './reviewsSlice';

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        cinemas: cinemasReducer,
        favourites: favouritesReducer,
        reviews: reviewsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
