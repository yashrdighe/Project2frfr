import { Request, Response } from 'express';
import axios from 'axios';
import RecentSearch from '../models/RecentSearch';

interface Genre {
  id: number;
  name: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  original_language: string;
}

interface TMDBResponse {
  results: TMDBMovie[];
  page: number;
  total_results: number;
  total_pages: number;
}

interface FilterParams {
  genres?: string[];
  languages?: string[];
  minRating?: number;
  releaseYearStart?: number;
  releaseYearEnd?: number;
}

// Add type assertion to ensure TMDB_API_KEY is treated as a string
const TMDB_API_KEY = process.env.TMDB_API_KEY as string;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const { genres, languages, minRating, releaseYearStart, releaseYearEnd } = req.body as FilterParams;
    
    console.log("Received filters:", req.body);
    
    // Get genre IDs from TMDB
    const genreResponse = await axios.get<{ genres: Genre[] }>(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
    
    console.log("Genre map:", genreResponse.data.genres);
    
    const genreMap: Record<string, number> = genreResponse.data.genres.reduce((acc: Record<string, number>, genre: Genre) => {
      acc[genre.name.toLowerCase()] = genre.id;
      return acc;
    }, {});
    
    // Convert genre names to IDs
    const genreIds = genres?.map((genre: string) => {
      const genreId = genreMap[genre.toLowerCase()];
      if (!genreId) console.log(`Genre not found: ${genre}`);
      return genreId;
    }).filter((id): id is number => id !== undefined) || [];
    
    console.log("Genre IDs:", genreIds);
    
    // Build query parameters with explicit type
    const params: Record<string, string | number | boolean> = {
      api_key: TMDB_API_KEY,
      include_adult: false,
      page: 1,
      sort_by: 'popularity.desc',
    };
    
    if (genreIds.length > 0) {
      params.with_genres = genreIds.join(',');
    }
    
    if (languages && languages.length > 0) {
      const langMap: Record<string, string> = {
        english: 'en',
        spanish: 'es',
        french: 'fr',
        hindi: 'hi',
        japanese: 'ja',
        mandarin: 'zh'
      };
      
      const languageCodes = languages.map((lang: string) => 
        langMap[lang.toLowerCase()] || lang.toLowerCase()
      ).filter(Boolean);
      
      if (languageCodes.length > 0) {
        params.with_original_language = languageCodes[0];
      }
      
      console.log("Language codes:", languageCodes);
    }
    
    if (minRating && minRating > 0) {
      params.vote_average_gte = minRating;
      params.vote_count_gte = 100;
    }
    
    if (releaseYearStart && releaseYearEnd) {
      params.primary_release_date_gte = `${releaseYearStart}-01-01`;
      params.primary_release_date_lte = `${releaseYearEnd}-12-31`;
    }
    
    console.log("TMDB API params:", params);
    
    // Make API request to TMDB
    const response = await axios.get<TMDBResponse>(`${TMDB_BASE_URL}/discover/movie`, { params });
    
    console.log(`Got ${response.data.results.length} results from TMDB`);
    
    // If we got no results, try a simpler query
    if (response.data.results.length === 0) {
      // Try a more basic query
      const simpleParams = {
        api_key: TMDB_API_KEY,
        sort_by: 'popularity.desc',
        page: 1
      };
      
      console.log("Trying simpler query:", simpleParams);
      const simpleResponse = await axios.get<TMDBResponse>(`${TMDB_BASE_URL}/discover/movie`, { params: simpleParams });
      
      if (simpleResponse.data.results.length > 0) {
        console.log("Simpler query returned results. Original filters may be too restrictive.");
        res.json(simpleResponse.data.results.slice(0, 10));
        return;
      }
    }
    
    res.json(response.data.results);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Failed to search movies', details: (error as Error).message });
  }
};

export const getMovieDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get movie details from TMDB
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`);
    
    // Save to recent searches
    const movieData = {
      movieId: response.data.id,
      title: response.data.title,
      poster_path: response.data.poster_path,
      release_date: response.data.release_date,
      vote_average: response.data.vote_average
    };
    
    // Check if movie already exists in recent searches
    const existingSearch = await RecentSearch.findOne({ movieId: response.data.id });
    
    if (existingSearch) {
      // Update timestamp
      existingSearch.timestamp = new Date();
      await existingSearch.save();
    } else {
      // Add new entry
      await RecentSearch.create(movieData);
      
      // Maintain only 5 recent searches
      const count = await RecentSearch.countDocuments();
      if (count > 5) {
        const oldest = await RecentSearch.findOne().sort({ timestamp: 1 });
        if (oldest) {
          await RecentSearch.deleteOne({ _id: oldest._id });
        }
      }
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('Error getting movie details:', error);
    res.status(500).json({ error: 'Failed to get movie details' });
  }
};

export const getRecentSearches = async (_req: Request, res: Response) => {
  try {
    const recentSearches = await RecentSearch.find()
      .sort({ timestamp: -1 })
      .limit(5);
    
    res.json(recentSearches);
  } catch (error) {
    console.error('Error getting recent searches:', error);
    res.status(500).json({ error: 'Failed to get recent searches' });
  }
};

