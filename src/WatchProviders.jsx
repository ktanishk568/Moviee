import React, { useMemo } from 'react';
import { IconSearch } from './icons';

const PROVIDERS = [
  { id: 'netflix', name: 'Netflix', color: '#E50914', bg: 'rgba(229, 9, 20, 0.15)' },
  { id: 'prime', name: 'Prime Video', color: '#00A8E1', bg: 'rgba(0, 168, 225, 0.15)' },
  { id: 'disney', name: 'Disney+', color: '#1CE783', bg: 'rgba(28, 231, 131, 0.15)' }, // Hulu/Disney vibe
  { id: 'hulu', name: 'Hulu', color: '#1CE783', bg: 'rgba(28, 231, 131, 0.15)' },
  { id: 'max', name: 'Max', color: '#6842FF', bg: 'rgba(104, 66, 255, 0.15)' },
  { id: 'apple', name: 'Apple TV+', color: '#f1f5f9', bg: 'rgba(255, 255, 255, 0.1)' },
];

// Generates a consistent subset of providers based on the imdbId string
function getMockProviders(imdbId) {
  if (!imdbId) return [];
  let hash = 0;
  for (let i = 0; i < imdbId.length; i++) {
    hash = imdbId.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  
  // Pick 1 to 3 providers based on hash
  const count = (hash % 3) + 1; 
  const selected = [];
  let tempHash = hash;
  
  for (let i = 0; i < count; i++) {
    const index = tempHash % PROVIDERS.length;
    if (!selected.includes(PROVIDERS[index])) {
      selected.push(PROVIDERS[index]);
    }
    tempHash = Math.floor(tempHash / 2);
  }
  return selected.length > 0 ? selected : [PROVIDERS[0]];
}

function WatchProviders({ imdbId, movieTitle }) {
  const available = useMemo(() => getMockProviders(imdbId), [imdbId]);

  return (
    <div className="watch-providers-section">
      <p className="section-label">Where to Watch</p>
      <div className="providers-list">
        {available.map((p) => (
          <a
            key={p.id}
            href={`https://www.google.com/search?q=watch+${encodeURIComponent(movieTitle)}+streaming`}
            target="_blank"
            rel="noopener noreferrer"
            className="provider-pill"
            style={{ '--p-color': p.color, '--p-bg': p.bg }}
            title={`Search for ${movieTitle} on ${p.name}`}
          >
            <span className="provider-dot" style={{ background: p.color }}></span>
            {p.name}
          </a>
        ))}
        {/* Universal search fallback */}
        <a 
          href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(movieTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="provider-pill provider-search"
        >
          <IconSearch size={12} /> Find all
        </a>
      </div>
    </div>
  );
}

export default WatchProviders;
