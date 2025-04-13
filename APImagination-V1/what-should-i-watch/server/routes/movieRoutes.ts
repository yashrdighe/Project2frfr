// server/routes/movieRoutes.ts
import express from 'express';
import { searchMovies, getMovieDetails, getRecentSearches } from '../controllers/movieController';

const router = express.Router();

router.post('/movies/search', searchMovies);
router.get('/movies/:id', getMovieDetails);
router.get('/recent-searches', getRecentSearches);

export default router;