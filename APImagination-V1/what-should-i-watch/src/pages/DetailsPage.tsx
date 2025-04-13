// src/pages/DetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import { Movie } from '../types/Movie';

const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(Number(id));
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  return (
    <div className="details-page">
      <header>
        <div className="logo">WHAT SHOULD I WATCH TONIGHT?</div>
        <div className="page-title">-{movie.title}-</div>
        <nav>
          <a href="/">Home</a>
          <a href="/recent-searches">Recent Searches</a>
        </nav>
      </header>
      
      <div className="movie-details">
        <div className="movie-poster">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        </div>
        
        <div className="movie-info">
          <div className="details-header">
            <p>Year: {new Date(movie.release_date).getFullYear()}</p>
            <p>Rating: {movie.vote_average.toFixed(1)}</p>
            <p>Genre: {movie.genres.join(', ')}</p>
            <p>Language: {movie.language}</p>
          </div>
          
          <div className="overview">
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;