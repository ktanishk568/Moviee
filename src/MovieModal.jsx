import React, { useEffect, useState } from 'react';
import { getDetails } from './api';
import ReviewSection from './ReviewSection';
import WatchProviders from './WatchProviders';
import {
  IconX, IconStar, IconClock, IconCalendar,
  IconImage, IconFilm, IconTv, IconGlobe,
  IconAward, IconDollar, IconDirector, IconAlert
} from './icons';

function MovieModal({ imdbId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!imdbId) return;
    setLoading(true);
    setDetails(null);
    setError('');
    getDetails(imdbId)
      .then(setDetails)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [imdbId]);

  const handleBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const hasPoster = details?.Poster && details.Poster !== 'N/A';
  const rating = details?.imdbRating !== 'N/A' ? details?.imdbRating : null;
  const votes = details?.imdbVotes !== 'N/A' ? details?.imdbVotes : null;
  const genres = details?.Genre?.split(', ').filter(g => g !== 'N/A') ?? [];
  const isSeries = details?.Type === 'series';

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Movie Details"
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          <IconX size={16} />
        </button>

        {loading && (
          <div className="modal-loading">
            <div className="spinner" />
            <span>Loading details</span>
          </div>
        )}

        {!loading && error && (
          <div className="modal-loading">
            <IconAlert size={36} />
            <p className="state-subtitle">{error}</p>
          </div>
        )}

        {!loading && details && (
          <>
            <div className="modal-body">
              {/* Poster column */}
              <div className="modal-poster-col">
                {hasPoster ? (
                  <img className="modal-poster" src={details.Poster} alt={`${details.Title} poster`} />
                ) : (
                  <div className="modal-no-poster">
                    <IconImage size={40} />
                    <span>No Poster</span>
                  </div>
                )}

                {rating && (
                  <div className="modal-imdb-box">
                    <div className="imdb-score">
                      <IconStar size={15} filled />
                      <span className="imdb-num">{rating}</span>
                      <span className="imdb-denom">/10</span>
                    </div>
                    {votes && <p className="imdb-votes">{votes} votes</p>}
                    <p className="imdb-label">IMDb</p>
                  </div>
                )}
              </div>

              {/* Info column */}
              <div className="modal-info-col">
                <div className="modal-type-badge">
                  {isSeries ? <><IconTv size={11} /> TV Series</> : <><IconFilm size={11} /> Movie</>}
                </div>

                <h2 className="modal-title">{details.Title}</h2>

                <div className="modal-meta-row">
                  {details.Year && details.Year !== 'N/A' && (
                    <div className="meta-chip"><IconCalendar size={12} /><span>{details.Year}</span></div>
                  )}
                  {details.Runtime && details.Runtime !== 'N/A' && (
                    <div className="meta-chip"><IconClock size={12} /><span>{details.Runtime}</span></div>
                  )}
                  {details.Rated && details.Rated !== 'N/A' && (
                    <div className="meta-chip rated">{details.Rated}</div>
                  )}
                </div>

                {genres.length > 0 && (
                  <div className="genre-tags">
                    {genres.map((g) => <span key={g} className="genre-tag">{g}</span>)}
                  </div>
                )}

                {/* Where to Watch */}
                <WatchProviders imdbId={imdbId} movieTitle={details.Title} />

                {details.Plot && details.Plot !== 'N/A' && (
                  <div className="modal-section">
                    <p className="section-label">Synopsis</p>
                    <p className="modal-plot">{details.Plot}</p>
                  </div>
                )}

                <div className="modal-detail-grid">
                  {details.Director && details.Director !== 'N/A' && (
                    <div className="detail-item">
                      <div className="detail-label"><IconDirector size={11} />Director</div>
                      <p className="detail-value">{details.Director}</p>
                    </div>
                  )}
                  {details.Actors && details.Actors !== 'N/A' && (
                    <div className="detail-item">
                      <div className="detail-label"><IconDirector size={11} />Cast</div>
                      <p className="detail-value">{details.Actors}</p>
                    </div>
                  )}
                  {details.Language && details.Language !== 'N/A' && (
                    <div className="detail-item">
                      <div className="detail-label"><IconGlobe size={11} />Language</div>
                      <p className="detail-value">{details.Language}</p>
                    </div>
                  )}
                  {details.Country && details.Country !== 'N/A' && (
                    <div className="detail-item">
                      <div className="detail-label"><IconGlobe size={11} />Country</div>
                      <p className="detail-value">{details.Country}</p>
                    </div>
                  )}
                  {details.BoxOffice && details.BoxOffice !== 'N/A' && (
                    <div className="detail-item">
                      <div className="detail-label"><IconDollar size={11} />Box Office</div>
                      <p className="detail-value">{details.BoxOffice}</p>
                    </div>
                  )}
                  {details.Awards && details.Awards !== 'N/A' && (
                    <div className="detail-item full-width">
                      <div className="detail-label"><IconAward size={11} />Awards</div>
                      <p className="detail-value">{details.Awards}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review section below the fold */}
            <div className="modal-reviews-wrap">
              <ReviewSection imdbId={imdbId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieModal;
