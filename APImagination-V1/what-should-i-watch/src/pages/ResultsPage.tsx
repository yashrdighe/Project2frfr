import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchMovies } from '../services/api';
import { Movie } from '../types/Movie';

const ResultsPage = () => {
  const location = useLocation();
  const { filters } = location.state || { filters: {} };
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log("Applying filters:", filters); // Debug log
        const data = await searchMovies(filters);
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (movies.length === 0) {
    return (
      <div className="results-page">
        <header>
          <div className="logo">WHAT SHOULD I WATCH TONIGHT?</div>
          <div className="page-title">-Results-</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/recent-searches">Recent Searches</Link>
          </nav>
        </header>
        
        <div className="no-results">
          <h2>No movies found matching your criteria</h2>
          <Link to="/" className="back-button">Try Different Filters</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <header>
        <div className="logo">WHAT SHOULD I WATCH TONIGHT?</div>
        <div className="page-title">-Results-</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/recent-searches">Recent Searches</Link>
        </nav>
      </header>
      
      <div className="results-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder.jpg'} 
              alt={movie.title} 
            />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>Year: {new Date(movie.release_date).getFullYear()}</p>
              <p>Rating: {movie.vote_average.toFixed(1)}</p>
              <Link to={`/details/${movie.id}`} className="view-details-button">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;

