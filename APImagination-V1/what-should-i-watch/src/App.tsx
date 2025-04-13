// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FindPage from './pages/FindPage';
import ResultsPage from './pages/ResultsPage';
import DetailsPage from './pages/DetailsPage';
import RecentSearchesPage from './pages/RecentSearchesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FindPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/recent-searches" element={<RecentSearchesPage />} />
      </Routes>
    </Router>
  );
}

export default App;