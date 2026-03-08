import { useState, useEffect, useCallback } from 'react';
import { supplyService } from '../services/index.js';

/**
 * Hook encapsulating supply data, CRUD operations, and refresh.
 * Single Responsibility: supply domain logic.
 */
export function useSupply() {
  const [supplies, setSupplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSupplies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await supplyService.fetchAll();
      setSupplies(data);
    } catch (err) {
      console.error('Failed to fetch supplies:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupplies();
  }, [fetchSupplies]);

  const rateSupply = useCallback(async (supplyId, newRating) => {
    try {
      await supplyService.rate(supplyId, newRating);
      setSupplies((prev) =>
        prev.map((s) => (s.supplyId === supplyId ? { ...s, rating: newRating } : s))
      );
    } catch (err) {
      console.error('Failed to rate supply:', err);
    }
  }, []);

  const deleteSupply = useCallback(async (supplyId) => {
    try {
      await supplyService.delete(supplyId);
      await fetchSupplies();
    } catch (err) {
      console.error('Failed to delete supply:', err);
    }
  }, [fetchSupplies]);

  const createSupply = useCallback(async (payload) => {
    await supplyService.create(payload);
    await fetchSupplies();
  }, [fetchSupplies]);

  return {
    supplies,
    isLoading,
    fetchSupplies,
    rateSupply,
    deleteSupply,
    createSupply,
  };
}
