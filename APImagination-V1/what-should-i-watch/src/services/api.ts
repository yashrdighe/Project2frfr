// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Your Express backend API

export const searchMovies = async (filters: {
  genres?: string[];
  language?: string[];
  minRating?: number;
  releaseYearStart?: number;
  releaseYearEnd?: number;
}) => {
  try {
    const response = await axios.post(`${API_URL}/movies/search`, filters);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};

export const getRecentSearches = async () => {
  try {
    const response = await axios.get(`${API_URL}/recent-searches`);
    return response.data;
  } catch (error) {
    console.error('Error getting recent searches:', error);
    throw error;
  }
};