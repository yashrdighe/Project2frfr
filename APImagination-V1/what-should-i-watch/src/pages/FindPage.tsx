import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const genres = ['Comedy', 'Mystery', 'Drama', 'Romance', 'Thriller', 'Horror', 'Sci-Fi'];
const languages = ['English', 'Spanish', 'French', 'Hindi', 'Japanese', 'Mandarin'];

const FindPage = () => {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [releaseYearStart, setReleaseYearStart] = useState<number>(1900);
  const [releaseYearEnd, setReleaseYearEnd] = useState<number>(2023);

  const handleGenreChange = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleLanguageChange = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const handleApply = () => {
    const filters = {
      genres: selectedGenres,
      languages: selectedLanguages,
      minRating,
      releaseYearStart,
      releaseYearEnd
    };
    
    // Navigate to results page with filters
    navigate('/results', { state: { filters } });
  };

  return (
    <div className="find-page">
      <header>
        <div className="logo">WHAT SHOULD I WATCH TONIGHT?</div>
        <div className="page-title">-Find-</div>
        <nav>
          <a href="/">Home</a>
          <a href="/recent-searches">Recent Searches</a>
        </nav>
      </header>
      
      <div className="filters-container">
        <div className="filter-section">
          <h3>Genre</h3>
          <div className="checkbox-group">
            {genres.map(genre => (
              <div className="checkbox-item" key={genre}>
                <input
                  type="checkbox"
                  id={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                <label htmlFor={genre}>{genre}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Language</h3>
          <div className="checkbox-group">
            {languages.map(language => (
              <div className="checkbox-item" key={language}>
                <input
                  type="checkbox"
                  id={language}
                  checked={selectedLanguages.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                />
                <label htmlFor={language}>{language}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Minimum Rating</h3>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
          />
          <span>{minRating}-10</span>
        </div>
        
        <div className="filter-section">
          <h3>Release Year</h3>
          <div className="year-range">
            <div>
              <label htmlFor="yearStart">From: </label>
              <input
                type="number"
                id="yearStart"
                min="1900"
                max="2023"
                value={releaseYearStart}
                onChange={(e) => setReleaseYearStart(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="yearEnd">To: </label>
              <input
                type="number"
                id="yearEnd"
                min="1900"
                max="2023"
                value={releaseYearEnd}
                onChange={(e) => setReleaseYearEnd(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <button className="apply-button" onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default FindPage;
