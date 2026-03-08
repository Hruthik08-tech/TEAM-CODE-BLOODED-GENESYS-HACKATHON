import { useMemo } from 'react';

/**
 * Generic hook for filtering and sorting a list.
 * Reusable across Supply and Demand (DRY, Open/Closed).
 *
 * @param {Array} items - Source list
 * @param {Object} filters - { searchQuery, filterStatus, filterCategory, sortBy }
 * @param {Object} config - { getName, getCategory, getStatus, getPrice, getRating }
 */
export function useFilteredList(items, filters, config) {
  const {
    searchQuery = '',
    filterStatus = 'all',
    filterCategory = 'all',
    sortBy = 'date',
  } = filters;
  const {
    getName = (i) => i.name,
    getCategory = (i) => i.category,
    getStatus = (i) => i.status,
    getPrice = (i) => i.price ?? i.maxPrice ?? 0,
    getRating = (i) => i.rating,
  } = config;

  return useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    let filtered = items.filter((item) => {
      const name = (getName(item) || '').toLowerCase();
      const category = (getCategory(item) || '').toLowerCase();
      const matchesSearch = !q || name.includes(q) || category.includes(q);
      const matchesStatus = filterStatus === 'all' || getStatus(item) === filterStatus;
      const matchesCategory = filterCategory === 'all' || getCategory(item) === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'price') return getPrice(b) - getPrice(a);
      if (sortBy === 'status') return getStatus(a).localeCompare(getStatus(b));
      if (sortBy === 'rating') {
        const ra = getRating(a);
        const rb = getRating(b);
        if (ra == null && rb == null) return 0;
        if (ra == null) return 1;
        if (rb == null) return -1;
        return rb - ra;
      }
      return 0;
    });

    return filtered;
  }, [items, searchQuery, filterStatus, filterCategory, sortBy, getName, getCategory, getStatus, getPrice, getRating]);
}
