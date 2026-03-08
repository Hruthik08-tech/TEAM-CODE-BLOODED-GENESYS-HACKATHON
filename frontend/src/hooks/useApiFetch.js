/**
 * Generic hook for API fetch with loading, error, and data state.
 * Abstracts fetch + state pattern. Uses service + method for stable deps (DIP).
 * @param {Object} service - Service object (e.g. dealService)
 * @param {string} method - Method name (e.g. 'fetchDeals')
 * @param {Array} args - Optional args to pass to the method
 * @param {Object} options - { enabled: boolean }
 */
import { useState, useEffect, useCallback } from 'react';

export function useApiFetch(service, method, args = [], { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fn = service[method];
      const result = await fn.apply(service, args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service, method, JSON.stringify(args)]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    execute();
  }, [enabled, execute]);

  return { data, isLoading, error, refetch: execute };
}
