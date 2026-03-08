import StarRating from './StarRating.jsx';

/**
 * Rating badge - shows "Not Rated" or star rating.
 * Composition over inheritance: wraps StarRating.
 */
export default function RatingBadge({ rating, onRate }) {
  if (rating == null) {
    return (
      <div className="rating-badge not-rated">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span>Not Rated</span>
      </div>
    );
  }
  return <StarRating rating={rating} onRate={onRate} size={16} />;
}
