import { useState, useEffect } from 'react';
import { categoryService } from '../services/index.js';

/**
 * Hook for fetching categories. Single responsibility: categories only.
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    categoryService.fetchCategories()
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch((err) => console.error('Failed to fetch categories:', err));
    return () => { cancelled = true; };
  }, []);

  return categories;
}
