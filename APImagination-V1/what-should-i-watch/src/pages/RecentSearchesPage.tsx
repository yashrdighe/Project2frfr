// src/pages/RecentSearchesPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentSearches } from '../services/api';
import { Movie } from '../types/Movie';

const RecentSearchesPage = () => {
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const data = await getRecentSearches();
        setRecentMovies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent searches:', error);
        setLoading(false);
      }
    };

    fetchRecentSearches();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="recent-searches-page">
      <header>
        <div className="logo">WHAT SHOULD I WATCH TONIGHT?</div>
        <div className="page-title">-Recent Searches-</div>
        <nav>
          <a href="/">Home</a>
        </nav>
      </header>
      
      <div className="recent-searches-list">
        <ol>
          {recentMovies.map((movie, index) => (
            <li key={movie.id}>
              <Link to={`/details/${movie.id}`}>{movie.title}</Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecentSearchesPage;