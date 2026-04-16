import React, { useState, useEffect, useCallback, useRef } from 'react';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import LoginPage from './LoginPage';
import { searchTitles } from './api';
import { useAuth } from './AuthContext';
import { IconSearch, IconFilm, IconTv } from './icons';
import './index.css';

const DEFAULT_QUERY = 'Avengers';

const TYPE_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Movies', value: 'movie' },
  { label: 'Series', value: 'series' },
];

function SkeletonGrid() {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-poster" />
          <div className="skeleton-info">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="user-menu" ref={ref}>
      <button
        id="user-avatar-btn"
        className="user-avatar-btn"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="user-avatar" style={{ background: user.color }}>
          {user.initials}
        </div>
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-info">
            <div className="user-avatar user-avatar-lg" style={{ background: user.color }}>
              {user.initials}
            </div>
            <div>
              <p className="user-dropdown-name">{user.name}</p>
              <p className="user-dropdown-email">{user.email}</p>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <button
            id="logout-btn"
            className="user-logout-btn"
            onClick={() => { setOpen(false); onLogout(); }}
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState(DEFAULT_QUERY);
  const [type, setType] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // Fetch movies on query/type change
  useEffect(() => {
    if (!activeQuery.trim()) return;
    setLoading(true);
    setError('');
    // Remove setResults([]) so old layout is preserved visually during load
    searchTitles(activeQuery, type)
      .then(setResults)
      .catch((err) => {
        setError(err.message);
        setResults([]); // clear only horizontally on real failure to show error state
      })
      .finally(() => setLoading(false));
  }, [activeQuery, type]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setActiveQuery(trimmed);
  }, [query]);

  // Show login page if not signed in
  // Placed AFTER hooks to prevent Rules of Hooks timing violations
  if (!user) return <LoginPage />;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <a className="logo" href="/" aria-label="CineSearch Home">
            <div className="logo-icon-wrap"><IconFilm size={16} /></div>
            <span className="logo-text">CineSearch</span>
          </a>

          <div className="search-wrapper">
            <form
              id="search-form"
              className="search-form"
              onSubmit={handleSearch}
              role="search"
            >
              <span className="search-icon"><IconSearch size={16} /></span>
              <input
                id="search-input"
                className="search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                autoComplete="off"
              />
              <button id="search-submit-btn" className="search-btn" type="submit">
                Search
              </button>
            </form>
          </div>

          <nav className="type-toggle" aria-label="Filter by type">
            {TYPE_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                id={`type-btn-${value || 'all'}`}
                className={`type-btn ${type === value ? 'active' : ''}`}
                onClick={() => setType(value)}
                aria-pressed={type === value}
              >
                {value === 'movie' && <IconFilm size={13} />}
                {value === 'series' && <IconTv size={13} />}
                {label}
              </button>
            ))}
          </nav>

          <UserMenu user={user} onLogout={logout} />
        </div>
      </header>

      {/* ── Hero ── */}
      {activeQuery === DEFAULT_QUERY && !error && (
        <section className="hero" aria-labelledby="hero-heading">
          <p className="hero-eyebrow">Powered by OMDB</p>
          <h1 id="hero-heading">
            Discover <span>Movies</span> &<br />
            <span>TV Shows</span> You'll Love
          </h1>
          <p>
            Search millions of titles — read plots, explore cast &amp; ratings, all in one place.
          </p>
        </section>
      )}

      {/* ── Main ── */}
      <main className="main" id="results" role="main">
        {(!loading || results.length > 0) && !error && (
          <div className="results-header" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
            <p className="results-title">
              Results for <strong>"{activeQuery}"</strong>
              {type && <span className="results-type-tag">{type === 'movie' ? 'Movies' : 'TV Series'}</span>}
            </p>
            <span className="results-count">{results.length} titles</span>
          </div>
        )}

        {/* Initial load skeleton (only when no results exist yet) */}
        {loading && results.length === 0 && !error && <SkeletonGrid />}

        {!loading && error && (
          <div className="state-container" role="alert">
            <div className="state-icon-wrap" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
              <IconSearch size={40} />
            </div>
            <h2 className="state-title">No results found</h2>
            <p className="state-subtitle">{error}. Try a different keyword or change the filter.</p>
          </div>
        )}

        {/* Results grid (stays mounted during subsequent loads, just fades slightly) */}
        {results.length > 0 && !error && (
          <div 
            className="movies-grid" 
            role="list" 
            aria-label="Search results"
            style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s', pointerEvents: loading ? 'none' : 'auto' }}
          >
            {results.map((movie) => (
              <div role="listitem" key={movie.imdbID}>
                <MovieCard movie={movie} onClick={setSelectedId} />
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedId && (
        <MovieModal imdbId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}

export default App;
