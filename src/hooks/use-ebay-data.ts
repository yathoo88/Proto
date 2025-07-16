import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseEbayDataOptions {
  endpoint: string;
  params?: Record<string, string>;
  enabled?: boolean;
}

export function useEbayData<T = unknown>({ endpoint, params, enabled = true }: UseEbayDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams(params);
        const url = `/api/ebay/${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast.error('Failed to load eBay data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, params, enabled]);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(params);
      const url = `/api/ebay/${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      toast.success('Data refreshed successfully');
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to refresh data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}