import { useState } from 'react';
import './StarRating.css';

/**
 * Reusable star rating display with optional interactive rating.
 * Single Responsibility: render star rating UI only.
 */
export default function StarRating({ rating, onRate, size = 18 }) {
  const [hovered, setHovered] = useState(0);

  const renderStar = (index) => {
    const filled = hovered > 0 ? index <= hovered : index <= (rating || 0);
    return (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? '#f59e0b' : 'none'}
        stroke={filled ? '#f59e0b' : '#cbd5e1'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="rating-star"
        style={{ cursor: onRate ? 'pointer' : 'default', transition: 'all 0.15s ease' }}
        onMouseEnter={() => onRate && setHovered(index)}
        onMouseLeave={() => onRate && setHovered(0)}
        onClick={(e) => {
          e.stopPropagation();
          onRate?.(index);
        }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  };

  return (
    <div className="star-rating-container">
      <div className="star-rating-stars">
        {[1, 2, 3, 4, 5].map((i) => renderStar(i))}
      </div>
      {rating != null && (
        <span className="star-rating-value">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
}
