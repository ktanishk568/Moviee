import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { IconStar } from './icons';

const REVIEWS_KEY = (imdbId) => `cinesearch_reviews_${imdbId}`;

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-picker" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= (hovered || value) ? 'star-active' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <IconStar size={20} filled={n <= (hovered || value)} />
        </button>
      ))}
      {value > 0 && (
        <span className="star-label">
          {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

function ReviewCard({ review, onDelete, isOwn }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar" style={{ background: review.userColor }}>
          {review.userInitials}
        </div>
        <div className="review-meta">
          <p className="review-name">{review.userName}</p>
          <p className="review-date">{date}</p>
        </div>
        <div className="review-stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <IconStar
              key={n}
              size={13}
              filled={n <= review.rating}
              style={{ color: n <= review.rating ? '#f59e0b' : 'var(--text-muted)' }}
            />
          ))}
        </div>
        {isOwn && (
          <button
            className="review-delete-btn"
            onClick={() => onDelete(review.id)}
            aria-label="Delete your review"
            title="Delete"
          >
            ×
          </button>
        )}
      </div>
      {review.text && <p className="review-text">{review.text}</p>}
    </div>
  );
}

function ReviewSection({ imdbId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load reviews from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY(imdbId));
      setReviews(stored ? JSON.parse(stored) : []);
    } catch {
      setReviews([]);
    }
  }, [imdbId]);

  const saveReviews = (updated) => {
    localStorage.setItem(REVIEWS_KEY(imdbId), JSON.stringify(updated));
    setReviews(updated);
  };

  const alreadyReviewed = user && reviews.some((r) => r.userId === user.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (!text.trim()) { setError('Please write something about the movie.'); return; }

    const newReview = {
      id: `${user.email}_${Date.now()}`,
      imdbId,
      userId: user.email,
      userName: user.name,
      userInitials: user.initials,
      userColor: user.color,
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    saveReviews([newReview, ...reviews]);
    setRating(0);
    setText('');
    setError('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleDelete = (id) => {
    saveReviews(reviews.filter((r) => r.id !== id));
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="review-section">
      <div className="review-section-header">
        <h3 className="review-section-title">Reviews</h3>
        {avgRating && (
          <div className="review-avg">
            <IconStar size={14} filled style={{ color: '#f59e0b' }} />
            <span>{avgRating}</span>
            <span className="review-avg-count">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Write review form */}
      {user && !alreadyReviewed && (
        <form id={`review-form-${imdbId}`} className="review-form" onSubmit={handleSubmit}>
          <div className="review-form-top">
            <div className="review-avatar" style={{ background: user.color }}>
              {user.initials}
            </div>
            <div style={{ flex: 1 }}>
              <p className="review-form-name">{user.name}</p>
              <StarPicker value={rating} onChange={(v) => { setRating(v); setError(''); }} />
            </div>
          </div>
          <textarea
            id={`review-textarea-${imdbId}`}
            className="review-textarea"
            value={text}
            onChange={(e) => { setText(e.target.value); setError(''); }}
            placeholder="Share your thoughts about this movie..."
            rows={3}
            maxLength={500}
          />
          <div className="review-form-footer">
            {error && <p className="review-error">{error}</p>}
            {submitted && <p className="review-success">Review posted!</p>}
            <span className="review-charcount">{text.length}/500</span>
            <button
              id={`review-submit-btn-${imdbId}`}
              className="review-submit-btn"
              type="submit"
            >
              Post Review
            </button>
          </div>
        </form>
      )}

      {/* Already reviewed notice */}
      {user && alreadyReviewed && (
        <p className="review-already">You have already reviewed this movie.</p>
      )}

      {/* Not logged in */}
      {!user && (
        <div className="review-login-prompt">
          <p>Sign in to leave a review</p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              isOwn={user?.email === r.userId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="review-empty">No reviews yet. Be the first!</p>
      )}
    </div>
  );
}

export default ReviewSection;
