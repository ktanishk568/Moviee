import React from 'react';
import { IconFilm, IconTv, IconImage } from './icons';

const TYPE_LABEL = {
  movie: 'Movie',
  series: 'Series',
  game: 'Game',
};

function MovieCard({ movie, onClick }) {
  const hasPoster = movie.Poster && movie.Poster !== 'N/A';
  const typeLabel = TYPE_LABEL[movie.Type] ?? movie.Type;

  return (
    <article
      className="movie-card"
      onClick={() => onClick(movie.imdbID)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.Title}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(movie.imdbID)}
    >
      <div className="card-poster-wrap">
        {hasPoster ? (
          <img
            className="card-poster"
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
          />
        ) : (
          <div className="card-no-poster" aria-label="No poster available">
            <IconImage size={32} />
            <span>No Poster</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="card-overlay">
          <span className="card-view-label">View Details</span>
        </div>

        {/* Type badge */}
        <span className="card-type-badge">
          {movie.Type === 'series'
            ? <><IconTv size={10} /> Series</>
            : <><IconFilm size={10} /> {typeLabel}</>
          }
        </span>
      </div>

      <div className="card-info">
        <h3 className="card-title">{movie.Title}</h3>
        <p className="card-year">{movie.Year}</p>
      </div>
    </article>
  );
}

export default MovieCard;
