import { API_KEY } from '@/secret';
import { Movie, Cinema } from '../types';

const BASE_URL = 'https://api.kvikmyndir.is';

const headers = {
    'x-access-token': API_KEY,
    'Content-Type': 'application/json',
};

async function apiRequest<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${text}`);
    }
    return res.json();
}

export async function fetchMovies(): Promise<Movie[]> {
    return apiRequest<Movie[]>('/movies');
}

export async function fetchUpcomingMovies(): Promise<Movie[]> {
    return apiRequest<Movie[]>('/upcoming');
}

export async function fetchCinemas(): Promise<Cinema[]> {
    return apiRequest<Cinema[]>('/theaters');
}

export async function fetchMovieById(id: number): Promise<Movie> {
    return apiRequest<Movie>(`/movies/${id}`);
}
