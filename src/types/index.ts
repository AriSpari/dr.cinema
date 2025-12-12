export type Person = {
    name: string;
};

export type Genre = {
    ID: number;
    Name: string;
    NameEN: string;
};

export type Certificate = {
    is: string;
    color: string;
    number: string;
};

export type Rating = {
    Source: string;
    Value: string;
};

export type OmdbData = {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Rating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    tomatoMeter: string;
    tomatoRating: string;
    tomatoURL: string;
};

export type Schedule = {
    time: string;
    purchase_url: string;
    info?: string;
};

export type Showtime = {
    cinema: {
        id: number;
        name: string;
    };
    cinema_name: string;
    schedule: Schedule[];
};

export type Trailer = {
    url?: string;
    results?: {
        id: string;
        key: string;
        name: string;
        site: string;
        type: string;
    }[];
};

export type Movie = {
    _id: string;
    id: number;
    title: string;
    actors_abridged: Person[];
    alternativeTitles?: string;
    certificate: Certificate;
    certificateIS: string;
    certificateImg?: string;
    directors_abridged: Person[];
    durationMinutes: number;
    genres: Genre[];
    ids: {
        imdb: string;
        rotten: string;
        tmdb: string;
    };
    omdb: OmdbData[];
    plot: string;
    poster: string;
    ratings: {
        imdb: string;
        rotten_audience: string;
        rotten_critics: string;
    };
    showtimes: Showtime[];
    trailers: Trailer[];
    year: string;
};

export type Cinema = {
    id: number;
    name: string;
    description?: string;
    address?: string;
    city?: string;
    phone?: string;
    website?: string;
};

export type Review = {
    id: string;
    movieId: number;
    rating: number;
    text: string;
    createdAt: string;
};
