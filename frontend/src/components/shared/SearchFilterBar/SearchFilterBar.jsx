import './SearchFilterBar.css';

/**
 * Reusable search and filter bar.
 * Props are minimal and generic (Open/Closed for different filter configs).
 */
export default function SearchFilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterCategory,
  onFilterCategoryChange,
  sortBy,
  onSortChange,
  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ],
  categoryOptions = [],
  sortOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'price', label: 'Sort by Price' },
    { value: 'status', label: 'Sort by Status' },
    { value: 'rating', label: 'Sort by Rating' },
  ],
}) {
  return (
    <div className="filter-controls">
      <div className="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-row">
        <select value={filterStatus} onChange={(e) => onFilterStatusChange?.(e.target.value)} className="filter-select">
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select value={filterCategory} onChange={(e) => onFilterCategoryChange?.(e.target.value)} className="filter-select">
          <option value="all">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => onSortChange?.(e.target.value)} className="filter-select">
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
