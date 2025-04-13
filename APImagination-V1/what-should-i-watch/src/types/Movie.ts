// src/types/Movie.ts
export interface Movie {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    genres: string[];
    overview: string;
    poster_path: string;
    language: string;
  }