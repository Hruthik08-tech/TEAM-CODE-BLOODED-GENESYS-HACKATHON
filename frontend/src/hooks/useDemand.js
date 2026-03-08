import { useState, useEffect, useCallback } from 'react';
import { demandService } from '../services/index.js';

/**
 * Hook encapsulating demand data, CRUD operations, and refresh.
 * Single Responsibility: demand domain logic.
 */
export function useDemand() {
  const [demands, setDemands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDemands = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await demandService.fetchAll();
      setDemands(data);
    } catch (err) {
      console.error('Failed to fetch demands:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemands();
  }, [fetchDemands]);

  const rateDemand = useCallback(async (demandId, newRating) => {
    try {
      await demandService.rate(demandId, newRating);
      setDemands((prev) =>
        prev.map((d) => (d.demandId === demandId ? { ...d, rating: newRating } : d))
      );
    } catch (err) {
      console.error('Failed to rate demand:', err);
    }
  }, []);

  const deleteDemand = useCallback(async (demandId) => {
    try {
      await demandService.delete(demandId);
      await fetchDemands();
    } catch (err) {
      console.error('Failed to delete demand:', err);
    }
  }, [fetchDemands]);

  const createDemand = useCallback(async (payload) => {
    await demandService.create(payload);
    await fetchDemands();
  }, [fetchDemands]);

  return {
    demands,
    isLoading,
    fetchDemands,
    rateDemand,
    deleteDemand,
    createDemand,
  };
}
